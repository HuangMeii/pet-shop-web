package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.UserUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.UserResponse;
import com.funcoders.happy_pet_shop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreationRequest request);

    void updateUser(@MappingTarget User userEntity, UserUpdateRequest request);

    UserResponse toResponse(User userEntity);
}
