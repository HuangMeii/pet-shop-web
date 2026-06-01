package com.funcoders.happy_pet_shop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.funcoders.happy_pet_shop.entity.KnowledgeEmbedding;
import com.funcoders.happy_pet_shop.repository.KnowledgeEmbeddingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VectorService {

    KnowledgeEmbeddingRepository knowledgeEmbeddingRepository;
    OpenAIService openAIService;
    ObjectMapper objectMapper;

    /**
     * Index a document into the knowledge base
     */
    @Transactional
    public void indexDocument(String content, Map<String, String> metadata) {
        try {
            List<Double> embedding = openAIService.generateEmbedding(content);
            String vectorStr = openAIService.embeddingToVectorString(embedding);
            String metadataJson = objectMapper.writeValueAsString(metadata);

            KnowledgeEmbedding doc = KnowledgeEmbedding.builder()
                    .content(content)
                    .metadata(metadataJson)
                    .embedding(vectorStr)
                    .build();

            knowledgeEmbeddingRepository.save(doc);
            log.info("Indexed document: {}", metadata);
        } catch (Exception e) {
            log.error("Failed to index document: {}", e.getMessage());
        }
    }

    /**
     * Search for similar documents in the knowledge base
     */
    public List<Map<String, Object>> similaritySearch(String query, int limit) {
        try {
            List<Double> queryEmbedding = openAIService.generateEmbedding(query);
            String vectorStr = openAIService.embeddingToVectorString(queryEmbedding);

            List<KnowledgeEmbedding> results = knowledgeEmbeddingRepository.findSimilarByEmbedding(vectorStr, limit);

            return results.stream().map(doc -> {
                try {
                    Map<String, Object> meta = objectMapper.readValue(doc.getMetadata(), Map.class);
                    return Map.<String, Object>of(
                            "content", doc.getContent(),
                            "metadata", meta
                    );
                } catch (Exception e) {
                    return Map.<String, Object>of("content", doc.getContent());
                }
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to search similar documents: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Build system prompt from search results
     */
    public String buildContextPrompt(String userMessage) {
        List<Map<String, Object>> relevantDocs = similaritySearch(userMessage, 5);

        if (relevantDocs.isEmpty()) {
            return """
                    Bạn là trợ lý hỗ trợ khách hàng của HappyPetShop - cửa hàng thú cưng.
                    Trả lời lịch sự, thân thiện bằng tiếng Việt.
                    Nếu không biết câu trả lời, hãy đề nghị chuyển sang nhân viên hỗ trợ.
                    """;
        }

        StringBuilder context = new StringBuilder();
        context.append("""
                Bạn là trợ lý hỗ trợ khách hàng của HappyPetShop - cửa hàng thú cưng.
                Trả lời lịch sự, thân thiện bằng tiếng Việt.
                Dựa vào thông tin sau để trả lời khách hàng:
                
                """);

        for (Map<String, Object> doc : relevantDocs) {
            context.append("- ").append(doc.get("content")).append("\n");
        }

        context.append("""
                
                Nếu thông tin trên không đủ để trả lời, hãy nói "Tôi cần chuyển sang nhân viên hỗ trợ để được tư vấn chi tiết hơn."
                """);

        return context.toString();
    }
}
