package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.constant.UserRole;
import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.CustomerResponse;
import com.funcoders.happy_pet_shop.entity.Cart;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.Role;
import com.funcoders.happy_pet_shop.entity.User;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.CustomerMapper;
import com.funcoders.happy_pet_shop.mapper.UserMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.RoleRepository;
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
public class CustomerService {
    CustomerRepository customerRepository;
    CustomerMapper customerMapper;

    UserRepository userRepository;
    UserMapper userMapper;

    RoleRepository roleRepository;

    PasswordEncoder passwordEncoder;

    @Transactional
    public CustomerResponse createCustomer(UserCreationRequest request) {
        Role userRole = roleRepository.findById(UserRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        User userEntity = userMapper.toEntity(request);
        userEntity.setUsername(userEntity.getPhone());
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setRoles(Set.of(userRole));

        Cart cart = new Cart();

        Customer customer = Customer.builder()
                .user(userEntity)
                .points(BigDecimal.ZERO)
                .cart(cart)
                .build();

        cart.setCustomer(customer);

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        return customers.stream().map(customerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        return customerMapper.toResponse(customer);
    }

    @Transactional
    public void deleteCustomer(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Customer customer = customerRepository.findByUser_Username(username)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        return customerMapper.toResponse(customer);
    }

    @Transactional
    public CustomerResponse addPoints(UUID customerId, BigDecimal points) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        customer.setPoints(customer.getPoints().add(points));

        return customerMapper.toResponse(customer);
    }
}
