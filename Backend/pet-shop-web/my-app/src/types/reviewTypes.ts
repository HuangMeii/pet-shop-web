export interface ProductReviewResponse {
  id: string;
  productId: string;
  productName?: string;
  customerId: string;
  customerName?: string;
  rating: number;
  comment?: string;
  sentimentLabel?: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewCreationRequest {
  productId: string;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface SentimentStatsResponse {
  totalReviews: number;
  positive: number;
  neutral: number;
  negative: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
}

export interface MonthlyTrendItem {
  year: number;
  month: number;
  reviewCount: number;
  averageRating: number;
}

export interface SentimentMonthlyTrendItem {
  year: number;
  month: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReviewStatisticsResponse {
  monthlyTrend: MonthlyTrendItem[];
  sentimentByRating: Record<number, SentimentStatsResponse>;
  sentimentMonthlyTrend: SentimentMonthlyTrendItem[];
  totalReviews?: number;
  averageRating?: number;
  productsWithReviews?: number;
  ratingDistribution?: Record<string, number>;
  monthlyReviewCounts?: Record<string, number>;
}
