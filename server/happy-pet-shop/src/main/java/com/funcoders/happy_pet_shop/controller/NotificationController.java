package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.NotificationResponse;
import com.funcoders.happy_pet_shop.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @GetMapping("/customer/{customerId}")
    public ApiResponse<List<NotificationResponse>> getNotifications(@PathVariable UUID customerId) {
        List<NotificationResponse> responses = notificationService.getNotificationsByCustomerId(customerId);
        return new ApiResponse<>(responses, "Get notifications successfully");
    }

    @GetMapping("/customer/{customerId}/unread-count")
    public ApiResponse<Long> getUnreadCount(@PathVariable UUID customerId) {
        long count = notificationService.getUnreadCount(customerId);
        return new ApiResponse<>(count, "Get unread count successfully");
    }

    @PostMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable UUID notificationId) {
        notificationService.markAsRead(notificationId);
        return new ApiResponse<>(null, "Mark as read successfully");
    }

    @PostMapping("/customer/{customerId}/read-all")
    public ApiResponse<Void> markAllAsRead(@PathVariable UUID customerId) {
        notificationService.markAllAsRead(customerId);
        return new ApiResponse<>(null, "Mark all as read successfully");
    }
}
