const IMAGE_SEARCH_BASE_URL = "http://localhost:3002";

export interface ImageSearchResult {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  type: "product" | "pet";
  description: string;
  category: string;
  similarity: number;
}

/**
 * Search for similar products/pets by uploading an image file.
 */
export async function searchByImage(
  file: File,
  topK: number = 20
): Promise<ImageSearchResult[]> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("top_k", String(topK));

  const res = await fetch(
    `${IMAGE_SEARCH_BASE_URL}/api/v1/search/image`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) throw new Error("Failed to search by image");
  return res.json();
}

/**
 * Search for similar products/pets by image URL.
 */
export async function searchByImageUrl(
  imageUrl: string,
  topK: number = 20
): Promise<ImageSearchResult[]> {
  const res = await fetch(
    `${IMAGE_SEARCH_BASE_URL}/api/v1/search/image-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, top_k: topK }),
    }
  );
  if (!res.ok) throw new Error("Failed to search by image URL");
  return res.json();
}

/**
 * Search for products/pets by text description using CLIP.
 */
export async function searchByText(
  text: string,
  topK: number = 20
): Promise<ImageSearchResult[]> {
  const res = await fetch(
    `${IMAGE_SEARCH_BASE_URL}/api/v1/search/text`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, top_k: topK }),
    }
  );
  if (!res.ok) throw new Error("Failed to search by text");
  return res.json();
}

/**
 * Get server health status.
 */
export async function getImageSearchHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${IMAGE_SEARCH_BASE_URL}/`);
    return res.ok;
  } catch {
    return false;
  }
}
