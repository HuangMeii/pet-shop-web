package com.funcoders.happy_pet_shop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class OpenAIService {

    final ObjectMapper objectMapper;

    @Value("${openai.api-key}")
    String apiKey;

    @Value("${openai.model:gpt-4o-mini}")
    String model;

    RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .build();

    /**
     * Generate embedding vector for a text using OpenAI Embedding API
     */
    public List<Double> generateEmbedding(String text) {
        try {
            String response = restClient.post()
                    .uri("/embeddings")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(Map.of(
                            "model", "text-embedding-3-small",
                            "input", text
                    ))
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode embeddingArray = root.get("data").get(0).get("embedding");

            return objectMapper.convertValue(embeddingArray, List.class);
        } catch (Exception e) {
            log.error("Failed to generate embedding: {}", e.getMessage());
            throw new RuntimeException("OpenAI embedding failed", e);
        }
    }

    /**
     * Convert embedding list to PostgreSQL vector string format
     */
    public String embeddingToVectorString(List<Double> embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(embedding.get(i));
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Chat completion with context from vector search
     */
    public String chatCompletion(String systemPrompt, String userMessage) {
        try {
            String response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(Map.of(
                            "model", model,
                            "messages", List.of(
                                    Map.of("role", "system", "content", systemPrompt),
                                    Map.of("role", "user", "content", userMessage)
                            ),
                            "temperature", 0.7,
                            "max_tokens", 500
                    ))
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            log.error("Failed to get chat completion: {}", e.getMessage());
            return "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.";
        }
    }
}
