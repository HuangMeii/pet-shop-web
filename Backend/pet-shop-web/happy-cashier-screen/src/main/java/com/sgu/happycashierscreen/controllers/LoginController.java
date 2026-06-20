package com.sgu.happycashierscreen.controllers;

import com.sgu.happycashierscreen.dto.request.AuthRequest;
import com.sgu.happycashierscreen.dto.response.AuthResponse;
import com.sgu.happycashierscreen.services.AuthService;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.PrimitiveIterator;

public class LoginController {
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private CheckBox rememberCheckbox;

    private final AuthService authService = new AuthService();

    @FXML
    private void handleSignIn() {

        String username = usernameField.getText() != null ? usernameField.getText().trim() : "";
        String password = passwordField.getText() != null ? passwordField.getText() : "";

        if (username.isEmpty() || password.isEmpty()) {
            showAlert(Alert.AlertType.WARNING, "Please enter username and password");
            return;
        }

        try {
            // ===== 1. Tạo request =====
            AuthRequest request = AuthRequest.builder()
                    .username(username)
                    .password(password)
                    .build();

            // ===== 2. Gọi API login =====
            AuthResponse response = authService.login(request);

            // ===== 3. Kiểm tra token =====
            if (response == null || response.getToken() == null) {
                showAlert(Alert.AlertType.ERROR, "Login failed!");
                return;
            }

            // ===== 5. Chuyển màn hình =====
            AppNavigator.showCashier();

        } catch (Exception e) {
            e.printStackTrace();

            String msg = e.getMessage();

            // nếu backend trả lỗi JSON
            showAlert(Alert.AlertType.ERROR, "Sai tài khoản hoặc mật khẩu, vui lòng nhập lại 🥲🥲🥲");
        }
    }

    private void showAlert(Alert.AlertType type, String message) {
        Alert alert = new Alert(type);
        alert.setTitle("Login");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
