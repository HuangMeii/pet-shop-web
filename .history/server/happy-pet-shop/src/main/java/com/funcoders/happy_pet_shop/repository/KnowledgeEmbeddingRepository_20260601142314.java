package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.KnowledgeEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KnowledgeEmbeddingRepository extends JpaRepository<KnowledgeEmbedding, UUID> {

    @Query(value = "SELECT * FROM knowledge_embeddings ORDER BY embedding <-> CAST(?1 AS vector) LIMIT ?2", nativeQuery = true)
    List<KnowledgeEmbedding> findSimilarByEmbedding(String embedding, int limit);

    List<KnowledgeEmbedding> findByMetadataContaining(String metadata);
}
