package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.configuration.JsonbConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "session_id", nullable = false)
    String sessionId;

    @Column(name = "sender_type", nullable = false, length = 10)
    String senderType;  // CUSTOMER, AI, STAFF

    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    @Column(name = "image_url", columnDefinition = "TEXT")
    String imageUrl;

    @Column(columnDefinition = "TEXT")
    String metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
