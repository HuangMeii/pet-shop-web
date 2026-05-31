package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.constant.UserRole;
import com.funcoders.happy_pet_shop.dto.request.StaffCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.StaffResponse;
import com.funcoders.happy_pet_shop.dto.response.UserResponse;
import com.funcoders.happy_pet_shop.entity.*;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.StaffMapper;
import com.funcoders.happy_pet_shop.mapper.UserMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.RoleRepository;
import com.funcoders.happy_pet_shop.repository.StaffRepository;
import com.funcoders.happy_pet_shop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffService {
    RoleRepository roleRepository;

    PasswordEncoder passwordEncoder;

    UserMapper userMapper;
    UserRepository userRepository;

    StaffMapper staffMapper;
    StaffRepository staffRepository;

    CustomerRepository customerRepository;

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public StaffResponse createStaff(StaffCreationRequest request) {
        // find roles
        Role staffRole = roleRepository.findById(UserRole.STAFF_ROLE)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        Role customerRole = roleRepository.findById(UserRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        // get user creation request
        UserCreationRequest userCreationRequest = request.getUserCreationRequest();

        // map request into entity, set username, role and encode password
        User userEntity = userMapper.toEntity(userCreationRequest);
        userEntity.setUsername(userEntity.getPhone());
        userEntity.setPassword(passwordEncoder.encode(userCreationRequest.getPassword()));
        userEntity.setRoles(Set.of(staffRole, customerRole));

        // save user
        User managedUser = userRepository.save(userEntity);

        // create staff entity
        Staff staff = Staff.builder()
                .user(managedUser)
                .shift(request.getShift())
                .build();

        // create and save customer entity
        Cart cart = new Cart();
        Customer customer = Customer.builder()
                .user(userEntity)
                .points(BigDecimal.ZERO)
                .cart(cart)
                .build();
        cart.setCustomer(customer);
        customerRepository.save(customer);

        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffById(UUID staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        return staffMapper.toResponse(staff);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(staffMapper::toResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public StaffResponse updateStaffShift(UUID staffId, int shift) {

        if (shift < 1 || shift > 3) {
            throw new AppException(ErrorType.BAD_REQUEST);
        }

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        staff.setShift(shift);

        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteStaff(UUID staffId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        staffRepository.delete(staff);
    }


    public StaffResponse getInfo() {
        // get object name from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // find user
        Staff staff = staffRepository.findByUser_Username(username)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        return staffMapper.toResponse(staff);
    }
}

