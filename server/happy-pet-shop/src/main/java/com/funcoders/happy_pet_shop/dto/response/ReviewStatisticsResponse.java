package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewStatisticsResponse {

    List<MonthlyTrendItem> monthlyTrend;
    Map<Integer, SentimentStatsResponse> sentimentByRating;
    List<SentimentMonthlyTrendItem> sentimentMonthlyTrend;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MonthlyTrendItem {
        int year;
        int month;
        long reviewCount;
        double averageRating;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SentimentMonthlyTrendItem {
        int year;
        int month;
        long positive;
        long neutral;
        long negative;
    }
}
