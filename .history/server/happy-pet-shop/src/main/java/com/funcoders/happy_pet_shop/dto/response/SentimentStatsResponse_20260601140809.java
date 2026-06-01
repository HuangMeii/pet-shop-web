package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SentimentStatsResponse {
    long totalReviews;
    long positive;
    long neutral;
    long negative;
    double positivePercent;
    double neutralPercent;
    double negativePercent;
}
