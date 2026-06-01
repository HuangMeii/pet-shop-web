export interface ProductReviewResponse {
  id: string;
  productId: string;
  productName?: string;
  customerId: string;
  customerName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewCreationRequest {
  productId: string;
  rating: number;
  comment?: string;
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}
