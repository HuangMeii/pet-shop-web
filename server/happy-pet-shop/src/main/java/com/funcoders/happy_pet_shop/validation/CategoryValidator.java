package com.funcoders.happy_pet_shop.validation;

import com.funcoders.happy_pet_shop.constant.UserStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class CategoryValidator implements ConstraintValidator<CategoryConstraint, String> {
    private Set<String> validCategories;

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null) {
            return true;
        }
        return validCategories.contains(s);
    }

    @Override
    public void initialize(CategoryConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        validCategories = Arrays.stream(UserStatus.values())
                .map(Enum::name)
                .collect(Collectors.toSet());

    }
}
