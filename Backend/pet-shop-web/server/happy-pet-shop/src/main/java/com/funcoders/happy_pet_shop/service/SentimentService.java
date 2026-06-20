package com.funcoders.happy_pet_shop.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class SentimentService {

    private final RestClient restClient;

    @Value("${sentiment.base-url}")
    private String baseUrl;

    public SentimentService() {
        this.restClient = RestClient.create();
    }

    /**
     * Analyze the sentiment of a review comment by calling the sentiment analysis server.
     * Returns a SentimentResult with label and confidence scores.
     * Returns null if the server is unavailable or an error occurs.
     */
    public SentimentResult analyze(String comment) {
        if (comment == null || comment.isBlank()) {
            return null;
        }

        SentimentRequest request = new SentimentRequest(comment);

        SentimentResponse response;
        try {
            response = restClient.post()
                    .uri(baseUrl + "/predict")
                    .body(request)
                    .retrieve()
                    .body(SentimentResponse.class);
        } catch (Exception e) {
            System.err.println("Sentiment analysis server unavailable: " + e.getMessage());
            return null;
        }

        if (response == null) {
            System.err.println("Sentiment analysis server returned null response");
            return null;
        }

        // Parse the label to extract the sentiment type
        String label = response.getLabel();
        String sentimentType = "NEUTRAL"; // default

        if (label != null) {
            if (label.contains("TÍCH CỰC") || label.contains("positive")) {
                sentimentType = "POSITIVE";
            } else if (label.contains("TIÊU CỰC") || label.contains("negative")) {
                sentimentType = "NEGATIVE";
            } else {
                sentimentType = "NEUTRAL";
            }
        }

        return new SentimentResult(
                sentimentType,
                response.getNeg(),
                response.getNeu(),
                response.getPos()
        );
    }

    @Data
    private static class SentimentRequest {
        private String text;

        public SentimentRequest(String text) {
            this.text = text;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class SentimentResponse {
        private String label;
        private double neg;
        private double neu;
        private double pos;
        private String en;
        private String cleaned;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SentimentResult {
        private final String sentimentType; // POSITIVE, NEUTRAL, NEGATIVE
        private final double negativePercent;
        private final double neutralPercent;
        private final double positivePercent;

        public SentimentResult(String sentimentType, double negativePercent, double neutralPercent, double positivePercent) {
            this.sentimentType = sentimentType;
            this.negativePercent = negativePercent;
            this.neutralPercent = neutralPercent;
            this.positivePercent = positivePercent;
        }
    }
}
