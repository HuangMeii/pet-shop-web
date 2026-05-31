package com.sgu.happycashierscreen.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {

    private String username;

    private String password;

    private String phone;

    private String address;

    private String role;
}