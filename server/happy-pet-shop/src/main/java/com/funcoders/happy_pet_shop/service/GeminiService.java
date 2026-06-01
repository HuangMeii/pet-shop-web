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
public class GeminiService {

    final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    String model;

    @Value("${gemini.embedding-model:text-embedding-004}")
    String embeddingModel;

    RestClient restClient = RestClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .build();

    /**
     * Generate embedding vector for a text using Gemini Embedding API
     */
    public List<Double> generateEmbedding(String text) {
        try {
            String response = restClient.post()
                    .uri("/models/" + embeddingModel + ":embedContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .body(Map.of(
                            "model", "models/" + embeddingModel,
                            "content", Map.of("parts", List.of(Map.of("text", text)))
                    ))
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode embeddingArray = root.get("embedding").get("values");

            return objectMapper.convertValue(embeddingArray, List.class);
        } catch (Exception e) {
            log.error("Failed to generate embedding: {}", e.getMessage());
            throw new RuntimeException("Gemini embedding failed", e);
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
                    .uri("/models/" + model + ":generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .body(Map.of(
                            "contents", List.of(
                                    Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt + "\n\n" + userMessage)))
                            ),
                            "generationConfig", Map.of(
                                    "temperature", 0.7,
                                    "maxOutputTokens", 500
                            )
                    ))
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
        } catch (Exception e) {
            log.error("Failed to get chat completion: {}", e.getMessage());
            return "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.";
        }
    }
}
