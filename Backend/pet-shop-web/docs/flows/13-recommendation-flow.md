# Luồng 13: Gợi ý sản phẩm AI (Recommendation)

## 1. Tổng quan

Hệ thống gợi ý sản phẩm sử dụng mô hình Hybrid kết hợp giữa ALS (Alternating Least Squares - Collaborative Filtering) và Content-Based Filtering để đề xuất sản phẩm phù hợp cho từng khách hàng.

## 2. Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              recommendationService.ts                     │   │
│  │  - getRecommendations(userId)                            │   │
│  │  - getSimilarProducts(productId)                         │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Recommendation Server (FastAPI - Python)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              /api/recommendations                         │   │
│  │  - GET /{user_id}?n=10                                   │   │
│  │  - GET /similar/{product_id}?n=5                         │   │
│  │  - POST /train                                           │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
│  ┌──────────────────────┴───────────────────────────────────┐   │
│  │              Models                                       │   │
│  │  ┌────────────────┐  ┌──────────────────────────────┐    │   │
│  │  │  ALS Model     │  │  Content-Based Model         │    │   │
│  │  │  (collaborative)│  │  (product features)         │    │   │
│  │  └───────┬────────┘  └──────────┬───────────────────┘    │   │
│  │          │                      │                         │   │
│  │          └──────────┬───────────┘                         │   │
│  │                     ▼                                     │   │
│  │              Hybrid Model                                  │   │
│  │         (weighted combination)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│              ┌─────────────────────────┐                        │
│              │      PostgreSQL         │                        │
│              │  (user-item interactions)│                       │
│              └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Models

### 3.1. ALS Model (Collaborative Filtering)

- **File:** `app/models/als.py`
- **Thuật toán:** Alternating Least Squares từ thư viện implicit
- **Input:** User-item interaction matrix (purchase history)
- **Output:** User và item latent factors
- **Cách hoạt động:** Dựa trên hành vi mua hàng của người dùng để tìm những người dùng tương tự và gợi ý sản phẩm

```python
model = implicit.als.AlternatingLeastSquares(factors=50, iterations=15)
model.fit(user_item_matrix)
```

### 3.2. Content-Based Model

- **File:** `app/models/content_based.py`
- **Input:** Product features (category, price range, description)
- **Output:** Product similarity matrix
- **Cách hoạt động:** Dựa trên đặc điểm sản phẩm để tìm sản phẩm tương tự

### 3.3. Hybrid Model

- **File:** `app/models/hybrid.py`
- **Kết hợp:** ALS score + Content-Based score với trọng số
- **Công thức:** `final_score = w1 * als_score + w2 * content_score`

## 4. Luồng xử lý chi tiết

### 4.1. Lấy gợi ý cho người dùng

```
[Client]                    [Recommendation Server]           [Database]
   |                           |                                |
   |--- GET /api/recommend --->|                                |
   |   /{userId}?n=10          |                                |
   |                           |                                |
   |                           |--- 1. Load user history ------>|
   |                           |    (purchased product IDs)     |
   |                           |                                |
   |                           |--- 2. ALS predict -------------|
   |                           |    score = model.user_factors  |
   |                           |    × item_factors.T            |
   |                           |                                |
   |                           |--- 3. Content-based score -----|
   |                           |    similarity with purchased   |
   |                           |                                |
   |                           |--- 4. Hybrid combination ------|
   |                           |    final_score = 0.7*als +     |
   |                           |    0.3*content                 |
   |                           |                                |
   |                           |--- 5. Filter purchased items --|
   |                           |    Remove already bought       |
   |                           |                                |
   |                           |--- 6. Get product details ---->|
   |                           |    (Spring Boot API)           |
   |                           |                                |
   |<-- {productIds, scores} --|                                |
```

### 4.2. Lấy sản phẩm tương tự

```
[Client]                    [Recommendation Server]
   |                           |
   |--- GET /api/recommend --->|
   |   /similar/{productId}    |
   |   ?n=5                    |
   |                           |
   |                           |--- Content-based similarity ---
   |                           |    Dựa trên category, features
   |                           |
   |<-- {productIds, scores} --|
```

### 4.3. Huấn luyện mô hình

```
[Admin]                     [Recommendation Server]           [Database]
   |                           |                                |
   |--- POST /api/recommend -->|                                |
   |   /train                  |                                |
   |                           |--- Load all interactions ----->|
   |                           |--- Train ALS model ------------|
   |                           |--- Save model to disk ---------|
   |<-- {success: true} -------|                                |
```

## 5. API Endpoints (Recommendation Server)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/recommend/{user_id}` | Lấy gợi ý cho user |
| GET | `/api/recommend/similar/{product_id}` | Lấy sản phẩm tương tự |
| POST | `/api/recommend/train` | Huấn luyện lại mô hình |

## 6. Frontend Service

```typescript
// recommendationService.ts
export const getRecommendations = async (
  userId: string,
  n: number = 10
): Promise<string[]> => {
  const res = await axios.get(`${RECOMMENDATION_URL}/${userId}?n=${n}`);
  return res.data;
};

export const getSimilarProducts = async (
  productId: string,
  n: number = 5
): Promise<string[]> => {
  const res = await axios.get(
    `${RECOMMENDATION_URL}/similar/${productId}?n=${n}`
  );
  return res.data;
};
```

## 7. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `RecommendationsPage.tsx` | Trang gợi ý sản phẩm cho user |
| `RecommendationSection.tsx` | Component hiển thị gợi ý trên trang chủ |
| `recommendationService.ts` | Service gọi API recommendation |
