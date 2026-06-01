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
    VectorService vectorService;
    OpenAIService openAIService;
    SimpMessagingTemplate messagingTemplate;

    /**
     * Process a customer message: vector search → AI → respond or handoff
     */
    @Transactional
    public ChatResponse processMessage(String sessionId, String message, String customerId) {
        // 1. Save customer message
        ChatMessage customerMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .senderType("CUSTOMER")
                .content(message)
                .build();
        chatMessageRepository.save(customerMsg);

        // 2. Build context from vector search
        String systemPrompt = vectorService.buildContextPrompt(message);

        // 3. Get AI response
        String aiResponse = openAIService.chatCompletion(systemPrompt, message);

        // 4. Check if handoff is needed
        boolean handoffRequired = aiResponse.toLowerCase().contains("chuyển sang nhân viên")
                || aiResponse.toLowerCase().contains("nhân viên hỗ trợ");

        // 5. Save AI response
        ChatMessage aiMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .senderType("AI")
                .content(aiResponse)
                .metadata("{\"handoffRequired\": " + handoffRequired + "}")
                .build();
        chatMessageRepository.save(aiMsg);

        // 6. If handoff required, create ticket and notify staff
        if (handoffRequired) {
            createHandoffTicket(sessionId, customerId, message);
        }

        return ChatResponse.builder()
                .sessionId(sessionId)
                .senderType("AI")
                .content(aiResponse)
                .handoffRequired(handoffRequired)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Create a support ticket and notify staff via WebSocket
     */
    private void createHandoffTicket(String sessionId, String customerId, String customerMessage) {
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
            messagingTemplate.convertAndSend("/topic/staff/chat-requests",
                    Map.of(
                            "ticketId", ticket.getId().toString(),
                            "sessionId", sessionId,
                            "customerMessage", customerMessage,
                            "timestamp", LocalDateTime.now().toString()
                    ));
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
    public ChatResponse staffSendMessage(String sessionId, String message, UUID staffId) {
        ChatMessage staffMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .senderType("STAFF")
                .content(message)
                .build();
        chatMessageRepository.save(staffMsg);

        // Send to customer via WebSocket
        messagingTemplate.convertAndSend("/queue/chat/" + sessionId,
                Map.of(
                        "senderType", "STAFF",
                        "content", message,
                        "timestamp", LocalDateTime.now().toString()
                ));

        return ChatResponse.builder()
                .sessionId(sessionId)
                .senderType("STAFF")
                .content(message)
                .handoffRequired(false)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
