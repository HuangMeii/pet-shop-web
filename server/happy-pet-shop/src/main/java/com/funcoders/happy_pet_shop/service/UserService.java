package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.ChangePasswordRequest;
import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.UserUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.UserResponse;
import com.funcoders.happy_pet_shop.entity.User;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.UserMapper;
import com.funcoders.happy_pet_shop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.logging.log4j.CloseableThreadContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(UserCreationRequest request) {

        User userEntity = userMapper.toEntity(request);
        userEntity.setUsername(userEntity.getPhone());

        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        System.out.println(userEntity.getPassword());

        return userMapper.toResponse(userRepository.save(userEntity));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        user.setDeleteAt(LocalDateTime.now());
    }

    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        // get user from database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        // check if user has right to update
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = username.equals("admin");
        boolean isOwner = username.equals(user.getUsername());
        if (!isOwner && !isAdmin)
            throw new AppException(ErrorType.UNAUTHORIZED);

        userMapper.updateUser(user, request);

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getInfo() {
        // get object name from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        return userMapper.toResponse(user);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void updatePassword(UUID userId, ChangePasswordRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        // Check mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorType.PASSWORD_MISMATCH);
        }

        // Encode & save
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }}
