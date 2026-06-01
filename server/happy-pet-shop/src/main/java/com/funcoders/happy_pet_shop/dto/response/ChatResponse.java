package com.funcoders.happy_pet_shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponse {
    String sessionId;
    String senderType;  // CUSTOMER, STAFF, SYSTEM
    String content;
    String imageUrl;
    LocalDateTime timestamp;
}
