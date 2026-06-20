package com.funcoders.happy_pet_shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketResponse {
    UUID id;
    String sessionId;
    String customerName;
    String customerMessage;
    String status;
    String priority;
    String category;
    LocalDateTime createdAt;
}
