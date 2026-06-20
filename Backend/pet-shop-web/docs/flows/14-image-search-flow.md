# Luồng 14: Tìm kiếm hình ảnh AI (Image Search)

## 1. Tổng quan

Hệ thống tìm kiếm bằng hình ảnh sử dụng mô hình CLIP (Contrastive Language-Image Pre-training) của OpenAI để tìm kiếm sản phẩm dựa trên hình ảnh đầu vào. Người dùng có thể tải lên một hình ảnh và hệ thống sẽ tìm các sản phẩm tương tự trong cửa hàng.

## 2. Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ImageSearchPage.tsx                          │   │
│  │  - Upload image                                          │   │
│  │  - Display results                                       │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
│  ┌──────────────────────┴───────────────────────────────────┐   │
│  │              imageSearchService.ts                        │   │
│  │  - searchByImage(file)                                   │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Image Search Server (FastAPI - Python)              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              main.py                                      │   │
│  │  - POST /api/search/image                                │   │
│  │  - POST /api/search/text                                 │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
│  ┌──────────────────────┴───────────────────────────────────┐   │
│  │              CLIP Model (OpenAI)                          │   │
│  │  - image_encoder: ResNet/ViT                             │   │
│  │  - text_encoder: Transformer                             │   │
│  │  - Embedding dimension: 512                              │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
│  ┌──────────────────────┴───────────────────────────────────┐   │
│  │              product_service.py                           │   │
│  │  - get_all_products()                                    │   │
│  │  - compute_similarity()                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Luồng xử lý chi tiết

### 3.1. Tìm kiếm bằng hình ảnh

```
[Client]                    [Image Search Server]              [Database]
   |                           |                                |
   |--- POST /api/search ----->|                                |
   |   /image                  |                                |
   |   (multipart: file)       |                                |
   |                           |                                |
   |                           |--- 1. Load image --------------|
   |                           |    PIL Image.open()            |
   |                           |                                |
   |                           |--- 2. Extract image embedding -|
   |                           |    CLIP image_encoder          |
   |                           |    → 512-dim vector            |
   |                           |                                |
   |                           |--- 3. Load product embeddings -|
   |                           |    (pre-computed)              |
   |                           |                                |
   |                           |--- 4. Compute cosine similarity|
   |                           |    sim = cos(emb_query, emb_i) |
   |                           |                                |
   |                           |--- 5. Sort by similarity ------|
   |                           |    Top-K results               |
   |                           |                                |
   |                           |--- 6. Get product details ---->|
   |                           |    (Spring Boot API)           |
   |                           |                                |
   |<-- {results: [{productId, |                                |
   |     similarity, imageUrl}]|                                |
```

**Backend (Image Search Server - FastAPI):**
- **File:** `main.py`
- **Method:** `POST /api/search/image`
- **Xử lý:**
  1. Nhận file ảnh từ request
  2. Dùng CLIP model để encode ảnh thành vector embedding (512 dimensions)
  3. So sánh với embeddings của tất cả sản phẩm trong database
  4. Tính cosine similarity
  5. Trả về top-K sản phẩm tương tự nhất

### 3.2. Tìm kiếm bằng văn bản (Text Search)

```
[Client]                    [Image Search Server]
   |                           |
   |--- POST /api/search ----->|
   |   /text                   |
   |   {query: "chó vàng"}     |
   |                           |
   |                           |--- 1. Encode text query -------|
   |                           |    CLIP text_encoder           |
   |                           |    → 512-dim vector            |
   |                           |                                |
   |                           |--- 2. Compare with product ----|
   |                           |    image embeddings            |
   |                           |                                |
   |<-- {results} -------------|                                |
```

## 4. Công nghệ

| Component | Công nghệ |
|-----------|-----------|
| **Model** | OpenAI CLIP (ViT-B/32) |
| **Framework** | FastAPI (Python) |
| **Image Processing** | Pillow (PIL) |
| **Similarity** | Cosine Similarity |
| **Embedding Dim** | 512 |

## 5. API Endpoints (Image Search Server)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/search/image` | Tìm kiếm bằng hình ảnh (multipart) |
| POST | `/api/search/text` | Tìm kiếm bằng văn bản |

## 6. Frontend Service

```typescript
// imageSearchService.ts
export const searchByImage = async (file: File): Promise<SearchResult[]> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await axios.post(`${IMAGE_SEARCH_URL}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.results;
};
```

## 7. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `ImageSearchPage.tsx` | Trang tìm kiếm bằng hình ảnh - upload ảnh và hiển thị kết quả |
| `imageSearchService.ts` | Service gọi API image search |
