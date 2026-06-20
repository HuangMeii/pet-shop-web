# Luồng 5: Đánh giá sản phẩm (Review)

## 1. Tổng quan

Luồng đánh giá sản phẩm cho phép khách hàng viết đánh giá sau khi mua hàng. Hệ thống tích hợp AI để kiểm duyệt nội dung (moderation), phát hiện ngôn từ độc hại (toxic), và phân tích cảm xúc (sentiment).

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - tạo đánh giá, xem đánh giá |
| **ADMIN** | Quản trị viên - xem thống kê đánh giá, sentiment |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo đánh giá mới

```
[Client]                    [Server]                         [External AI Services]
   |                           |                                    |
   |--- POST /api/reviews ---->|                                    |
   |   /customer/{customerId}  |                                    |
   |   {productId, rating,     |                                    |
   |    comment, imageUrls[]}  |                                    |
   |                           |                                    |
   |                           |--- 1. Tìm Product --------> [DB]   |
   |                           |--- 2. Tìm Customer ------> [DB]   |
   |                           |--- 3. Check duplicate ----> [DB]   |
   |                           |                                    |
   |                           |--- 4. Check Toxic ---------------->|
   |                           |    (ToxicService)                  |
   |                           |    POST /predict (toxic server)    |
   |                           |<-- {toxic: false} -----------------|
   |                           |                                    |
   |                           |--- 5. Check Images (nếu có) ------>|
   |                           |    (ModerationService)             |
   |                           |    POST /moderate (mod server)     |
   |                           |<-- {flagged: false} ---------------|
   |                           |                                    |
   |                           |--- 6. Save Review + Images -> [DB] |
   |                           |                                    |
   |                           |--- 7. Analyze Sentiment ---------->|
   |                           |    (SentimentService)              |
   |                           |    POST /analyze (sentiment server)|
   |                           |<-- {sentiment: POSITIVE} ----------|
   |                           |                                    |
   |                           |--- 8. Update sentiment_label ->[DB]|
   |                           |                                    |
   |<-- ProductReviewResponse -|                                    |
```

**Backend:**
- **Controller:** `ReviewController.java`
- **Service:** `ReviewService.java`
- **Method:** `createReview(UUID customerId, ReviewCreationRequest request)`

#### Xử lý chi tiết:

**Bước 1-3: Validation**
```java
Product product = productRepository.findById(request.getProductId())
    .orElseThrow(() -> new RuntimeException("Product not found"));
Customer customer = customerRepository.findById(customerId)
    .orElseThrow(() -> new RuntimeException("Customer not found"));
// Check duplicate review
if (reviewRepository.existsByProductIdAndCustomerId(product.getId(), customerId)) {
    throw new RuntimeException("You have already reviewed this product");
}
```

**Bước 4: Kiểm tra Toxic (ngôn từ độc hại)**
```java
toxicService.checkComment(request.getComment());
// Gọi đến Toxic Classification Server (FastAPI)
// POST /predict với nội dung comment
// Nếu toxic = true → throw exception
```

**Bước 5: Kiểm duyệt hình ảnh (Moderation)**
```java
if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
    moderationService.checkImages(request.getImageUrls());
    // Gọi đến Moderation Server (FastAPI)
    // POST /moderate với danh sách image URLs
    // Nếu flagged = true → throw exception
    
    // Tạo ReviewImage entities
    List<ReviewImage> images = IntStream.range(0, request.getImageUrls().size())
        .mapToObj(i -> ReviewImage.builder()
            .review(review)
            .imageUrl(request.getImageUrls().get(i))
            .sortOrder(i)
            .build())
        .collect(Collectors.toList());
    review.setImages(images);
}
```

**Bước 7: Phân tích cảm xúc (Sentiment)**
```java
try {
    SentimentResult sentiment = sentimentService.analyze(request.getComment());
    if (sentiment != null) {
        review.setSentimentLabel(sentiment.getSentimentType()); // POSITIVE, NEUTRAL, NEGATIVE
        reviewRepository.save(review);
    }
} catch (Exception e) {
    System.err.println("Failed to analyze sentiment: " + e.getMessage());
    // Không throw exception - sentiment là optional
}
```

### 3.2. Xem đánh giá sản phẩm

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/reviews ----->|                                |
   |   /product/{productId}    |                                |
   |                           |--- Find by productId -------->|
   |                           |<-- List<Review> ---------------|
   |<-- ProductReviewResponse[]|                                |
```

**Backend:**
- **Method:** `getReviewsByProductId(UUID productId)`
- **Repository:** `reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)`

### 3.3. Xem thống kê đánh giá

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/reviews ----->|                                |
   |   /stats/{productId}      |                                |
   |                           |--- Tính averageRating -------->|
   |                           |--- Đếm totalReviews ---------->|
   |                           |--- Lấy ratingDistribution ---->|
   |<-- ReviewStatsResponse ---|                                |
```

**Response:**
```json
{
  "averageRating": 4.5,
  "totalReviews": 100,
  "ratingDistribution": {
    "1": 5, "2": 3, "3": 10, "4": 30, "5": 52
  }
}
```

### 3.4. Admin: Xem tất cả đánh giá

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/reviews ----->|                                |
   |   /admin/all              |                                |
   |                           |--- FindAll order by createdAt->|
   |<-- ProductReviewResponse[]|                                |
```

### 3.5. Admin: Thống kê Sentiment

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/reviews ----->|                                |
   |   /admin/sentiment-stats  |                                |
   |                           |--- Count by sentimentLabel --->|
   |<-- SentimentStatsResponse |                                |
```

**Response:**
```json
{
  "totalReviews": 200,
  "positive": 120,
  "neutral": 60,
  "negative": 20,
  "positivePercent": 60.0,
  "neutralPercent": 30.0,
  "negativePercent": 10.0
}
```

### 3.6. Admin: Thống kê đánh giá nâng cao

```
[Client]                    [Server]
   |                           |
   |--- GET /api/reviews ----->|
   |   /admin/statistics       |
   |                           |
   |                           |--- getMonthlyTrend() ----------
   |                           |   Group by year-month
   |                           |   Tính reviewCount + averageRating
   |                           |
   |                           |--- getSentimentByRating() -----
   |                           |   Với mỗi rating 1-5:
   |                           |   Tính positive/neutral/negative count
   |                           |
   |                           |--- getSentimentMonthlyTrend() -
   |                           |   Group by year-month
   |                           |   Tính positive/neutral/negative count
   |                           |
   |<-- ReviewStatisticsResponse
```

## 4. Cấu trúc dữ liệu

### Review Entity
```
Review {
    id: UUID (PK)
    product: Product (N-1)
    customer: Customer (N-1)
    rating: Integer (1-5)
    comment: String (Text)
    sentimentLabel: String (POSITIVE, NEUTRAL, NEGATIVE, nullable)
    images: List<ReviewImage>
    createdAt: LocalDateTime
}
```

### ReviewImage Entity
```
ReviewImage {
    id: UUID (PK)
    review: Review (N-1)
    imageUrl: String
    sortOrder: Integer
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/reviews/customer/{customerId}` | Tạo đánh giá mới | USER |
| GET | `/api/reviews/product/{productId}` | Lấy đánh giá theo sản phẩm | Public |
| GET | `/api/reviews/stats/{productId}` | Lấy thống kê đánh giá | Public |
| GET | `/api/reviews/customer/{customerId}` | Lấy đánh giá theo khách hàng | USER |
| GET | `/api/reviews/admin/all` | Lấy tất cả đánh giá | ADMIN |
| GET | `/api/reviews/admin/sentiment-stats` | Thống kê sentiment | ADMIN |
| GET | `/api/reviews/admin/statistics` | Thống kê đánh giá nâng cao | ADMIN |

## 6. AI Services tích hợp

| Service | Công nghệ | Mô tả |
|---------|-----------|-------|
| **ToxicService** | FastAPI | Kiểm tra ngôn từ độc hại trong comment |
| **ModerationService** | FastAPI | Kiểm duyệt hình ảnh (nội dung nhạy cảm) |
| **SentimentService** | FastAPI | Phân tích cảm xúc (Positive/Neutral/Negative) |

## 7. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `ReviewSection.tsx` | Component hiển thị đánh giá trên trang chi tiết sản phẩm |
| `ReviewPage.tsx` | Trang tạo đánh giá mới |
| `useReview.ts` | Hook quản lý state đánh giá |
| `ReviewStatisticsPage.tsx` | Trang thống kê đánh giá cho Admin |
| `reviewService.ts` | Service gọi API đánh giá |
