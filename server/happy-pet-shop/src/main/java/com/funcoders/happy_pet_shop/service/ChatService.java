package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.response.ChatResponse;
import com.funcoders.happy_pet_shop.entity.ChatMessage;
import com.funcoders.happy_pet_shop.entity.SupportTicket;
import com.funcoders.happy_pet_shop.repository.ChatMessageRepository;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.SupportTicketRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChatService {

    ChatMessageRepository chatMessageRepository;
    SupportTicketRepository supportTicketRepository;
    CustomerRepository customerRepository;
    SimpMessagingTemplate messagingTemplate;
    ModerationService moderationService;

    /**
     * Customer sends a message → creates a support ticket → notifies staff
     */
    @Transactional
    public ChatResponse processMessage(String sessionId, String message, String customerId, String imageUrl) {
        // 0. Check image moderation if image is provided
        if (imageUrl != null && !imageUrl.isEmpty()) {
            moderationService.checkImages(Collections.singletonList(imageUrl));
        }

        // 1. Save customer message
        ChatMessage customerMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .senderType("CUSTOMER")
                .content(message != null ? message : "")
                .imageUrl(imageUrl)
                .build();
        chatMessageRepository.save(customerMsg);

        // 2. Create a support ticket for staff to handle
        createSupportTicket(sessionId, customerId, message != null ? message : (imageUrl != null ? "[Hình ảnh]" : ""));

        // 3. Return response indicating the message was sent to staff
        return ChatResponse.builder()
                .sessionId(sessionId)
                .senderType("SYSTEM")
                .content("Đã gửi yêu cầu tư vấn. Nhân viên sẽ phản hồi trong thời gian sớm nhất.")
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Create a support ticket and notify staff via WebSocket
     */
    private void createSupportTicket(String sessionId, String customerId, String customerMessage) {
        SupportTicket ticket = SupportTicket.builder()
                .sessionId(sessionId)
                .customerMessage(customerMessage)
                .status("PENDING")
                .priority("NORMAL")
                .build();

        if (customerId != null) {
            try {
                ticket.setCustomer(customerRepository.getReferenceById(UUID.fromString(customerId)));
            } catch (Exception e) {
                log.warn("Invalid customerId: {}", customerId);
            }
        }

        ticket = supportTicketRepository.save(ticket);

        // Notify staff via WebSocket
        try {
            Map<String, Object> payload = Map.of(
                    "ticketId", ticket.getId().toString(),
                    "sessionId", sessionId,
                    "customerMessage", customerMessage,
                    "timestamp", LocalDateTime.now().toString()
            );
            messagingTemplate.convertAndSend("/topic/staff/chat-requests", (Object) payload);
            log.info("Notified staff about ticket: {}", ticket.getId());
        } catch (Exception e) {
            log.error("Failed to notify staff: {}", e.getMessage());
        }
    }

    /**
     * Get chat history for a session
     */
    public List<ChatMessage> getHistory(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    /**
     * Staff sends a message to a customer session
     */
    @Transactional
    public ChatResponse staffSendMessage(String sessionId, String message, UUID staffId, String imageUrl) {
        // Check image moderation if image is provided
        if (imageUrl != null && !imageUrl.isEmpty()) {
            moderationService.checkImages(Collections.singletonList(imageUrl));
        }

        ChatMessage staffMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .senderType("STAFF")
                .content(message != null ? message : "")
                .imageUrl(imageUrl)
                .build();
        chatMessageRepository.save(staffMsg);

        // Send to customer via WebSocket
        Map<String, Object> staffPayload = Map.of(
                "senderType", "STAFF",
                "content", message != null ? message : "",
                "imageUrl", imageUrl != null ? imageUrl : "",
                "timestamp", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/queue/chat/" + sessionId, (Object) staffPayload);

        return ChatResponse.builder()
                .sessionId(sessionId)
                .senderType("STAFF")
                .content(message != null ? message : "")
                .imageUrl(imageUrl)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
