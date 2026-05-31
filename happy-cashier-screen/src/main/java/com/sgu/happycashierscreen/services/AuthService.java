package com.sgu.happycashierscreen.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sgu.happycashierscreen.controllers.AppState;
import com.sgu.happycashierscreen.dto.request.AuthRequest;
import com.sgu.happycashierscreen.dto.response.ApiResponse;
import com.sgu.happycashierscreen.dto.response.AuthResponse;
import com.sgu.happycashierscreen.dto.response.StaffResponse;
import com.sgu.happycashierscreen.util.ApiClient;
import com.sgu.happycashierscreen.util.URLUtil;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.io.IOException;

import static com.sgu.happycashierscreen.util.ObjectMapperUtil.OBJECT_MAPPER;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthService {
    public static StaffResponse currentStaff;


    public AuthResponse login(AuthRequest request) throws IOException, InterruptedException {

        // ===== 1. Convert request → JSON =====
        String jsonRequest = OBJECT_MAPPER.writeValueAsString(request);

        // ===== 2. Call login API =====
        String response = ApiClient.post(URLUtil.AUTH.LOGIN, jsonRequest, false);

        // ===== 3. Parse login response =====
        AuthResponse authResponse = OBJECT_MAPPER.readValue(
                response,
                new TypeReference<ApiResponse<AuthResponse>>() {}
        ).getData();

        // ===== 4. Set token =====
        ApiClient.setToken(authResponse.getToken());

        // ===== 5. Call API lấy thông tin staff =====
        response = ApiClient.get(URLUtil.STAFF.GET_INFO, true);

        // ===== 6. Parse staff response (FIX Ở ĐÂY) =====
        StaffResponse staff = OBJECT_MAPPER.readValue(
                response,
                new TypeReference<ApiResponse<StaffResponse>>() {}
        ).getData();

        // ===== 7. Lưu current staff =====
        AppState.setStaffUser(staff);

        return authResponse;
    }

}
