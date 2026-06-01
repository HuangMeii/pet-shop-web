const RECOMMENDATION_BASE_URL = "http://localhost:8000";

export interface RecommendationItem {
  id: string;
  score: number;
  reason: string;
}

export interface RecommendationResponse {
  products: RecommendationItem[];
  pets: RecommendationItem[];
}

/**
 * Get hybrid recommendations (products + pets).
 * Supports both anonymous and user-specific recommendations.
 */
export async function getRecommendations(
  options?: {
    userId?: string;
    limit?: number;
  }
): Promise<RecommendationResponse> {
  const params = new URLSearchParams();
  if (options?.userId) params.set("user_id", options.userId);
  if (options?.limit) params.set("limit", String(options.limit));

  const url = `${RECOMMENDATION_BASE_URL}/api/v1/recommendations?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

/**
 * Get similar products based on a product ID.
 */
export async function getSimilarProducts(
  productId: string,
  limit: number = 8
): Promise<RecommendationItem[]> {
  const res = await fetch(
    `${RECOMMENDATION_BASE_URL}/api/v1/recommendations/similar-products`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, limit }),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch similar products");
  return res.json();
}

/**
 * Get similar pets based on a pet ID.
 */
export async function getSimilarPets(
  petId: string,
  limit: number = 8
): Promise<RecommendationItem[]> {
  const res = await fetch(
    `${RECOMMENDATION_BASE_URL}/api/v1/recommendations/similar-pets`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pet_id: petId, limit }),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch similar pets");
  return res.json();
}
