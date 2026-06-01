package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.ChatRequest;
import com.funcoders.happy_pet_shop.dto.response.ChatResponse;
import com.funcoders.happy_pet_shop.entity.ChatMessage;
import com.funcoders.happy_pet_shop.service.ChatService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;

    /**
     * REST endpoint: Send a message to the AI chatbot
     */
    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.processMessage(
                request.getSessionId(),
                request.getMessage(),
                request.getCustomerId()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * REST endpoint: Get chat history for a session
     */
    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String sessionId) {
        return ResponseEntity.ok(chatService.getHistory(sessionId));
    }

    /**
     * WebSocket endpoint: Customer sends a message
     */
    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public ChatResponse handleWebSocketMessage(@Payload Map<String, String> payload) {
        return chatService.processMessage(
                payload.get("sessionId"),
                payload.get("message"),
                payload.get("customerId")
        );
    }
}
