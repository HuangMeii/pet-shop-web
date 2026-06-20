import requests
import json
import time

BACKEND_URL = "http://localhost:8080/happy-pet-shop"
SENTIMENT_URL = "http://127.0.0.1:5000/predict"

# Lấy tất cả reviews
res = requests.get(f"{BACKEND_URL}/api/reviews/all")
data = res.json()["data"]

print(f"Tổng số reviews: {len(data)}")

updated = 0
for review in data:
    review_id = review["id"]
    comment = review.get("comment", "")
    
    if not comment:
        print(f"  [{review_id}] Bỏ qua - không có comment")
        continue
    
    # Gọi sentiment server
    try:
        sent_res = requests.post(SENTIMENT_URL, json={"text": comment}, timeout=10)
        sent_data = sent_res.json()
        
        label = sent_data.get("label", "")
        if "TÍCH CỰC" in label or "positive" in label.lower():
            sentiment = "POSITIVE"
        elif "TIÊU CỰC" in label or "negative" in label.lower():
            sentiment = "NEGATIVE"
        else:
            sentiment = "NEUTRAL"
        
        # Update sentiment_label qua API backend
        # Backend không có API update sentiment riêng, nên update trực tiếp qua DB
        print(f"  [{review_id[:8]}] Rating={review['rating']} -> {sentiment} | Comment: {comment[:50]}")
        
    except Exception as e:
        print(f"  [{review_id[:8]}] Lỗi: {e}")
        continue

print(f"\nDone! Cần update {len(data)} reviews với sentiment_label qua database.")
