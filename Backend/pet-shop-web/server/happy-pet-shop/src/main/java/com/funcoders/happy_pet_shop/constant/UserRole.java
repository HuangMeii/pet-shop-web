package com.funcoders.happy_pet_shop.constant;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PUBLIC, makeFinal = true)
public class UserRole {
    public static String ADMIN_ROLE = "ADMIN";
    public static String STAFF_ROLE = "STAFF";
    public static String USER_ROLE = "USER";
}
