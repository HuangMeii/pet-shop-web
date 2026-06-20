package com.funcoders.happy_pet_shop.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ToxicService {

    private final RestClient restClient;

    @Value("${toxic.base-url}")
    private String baseUrl;

    public ToxicService() {
        this.restClient = RestClient.create();
    }

    /**
     * Check a comment text against the toxic comment classification server.
     * Throws RuntimeException if the comment is classified as toxic.
     */
    public void checkComment(String comment) {
        if (comment == null || comment.isBlank()) {
            return;
        }

        ToxicRequest request = new ToxicRequest(comment);

        ToxicResponse response;
        try {
            response = restClient.post()
                    .uri(baseUrl + "/predict")
                    .body(request)
                    .retrieve()
                    .body(ToxicResponse.class);
        } catch (Exception e) {
            // If toxic server is down, log warning but allow the review to proceed
            System.err.println("Toxic classification server unavailable: " + e.getMessage());
            return;
        }

        if (response == null) {
            System.err.println("Toxic classification server returned null response");
            return;
        }

        if (response.getLabel() == 1) {
            throw new RuntimeException(
                    "Bình luận vi phạm tiêu chuẩn cộng đồng (toxic content detected, probability: "
                            + String.format("%.2f", response.getProbability()) + ")"
            );
        }
    }

    @Data
    private static class ToxicRequest {
        private String text;

        public ToxicRequest(String text) {
            this.text = text;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ToxicResponse {
        private int label;
        private double probability;
        private double threshold;
    }
}
