package com.funcoders.happy_pet_shop.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModerationService {

    private final RestClient restClient;

    @Value("${moderation.base-url}")
    private String baseUrl;

    public ModerationService() {
        this.restClient = RestClient.create();
    }

    /**
     * Check a list of image URLs against the moderation server.
     * Throws RuntimeException if any image is flagged.
     */
    public void checkImages(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        ModerationRequest request = new ModerationRequest(imageUrls);

        ModerationResponse response;
        try {
            response = restClient.post()
                    .uri(baseUrl + "/check-review-images")
                    .body(request)
                    .retrieve()
                    .body(ModerationResponse.class);
        } catch (Exception e) {
            // If moderation server is down, log warning but allow the review to proceed
            System.err.println("Moderation server unavailable: " + e.getMessage());
            return;
        }

        if (response == null) {
            System.err.println("Moderation server returned null response");
            return;
        }

        if (!response.isPassed() && response.getFlagged() != null && !response.getFlagged().isEmpty()) {
            String violations = response.getFlagged().stream()
                    .map(f -> "Image " + f.getIndex() + ": " + f.getViolations())
                    .collect(Collectors.joining("; "));
            throw new RuntimeException("Image moderation failed: " + violations);
        }
    }

    @Data
    private static class ModerationRequest {
        private List<String> imageUrls;

        public ModerationRequest(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ModerationResponse {
        private boolean passed;
        private List<FlaggedItem> flagged;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class FlaggedItem {
        private int index;
        private String url;
        private String violations;
    }
}
