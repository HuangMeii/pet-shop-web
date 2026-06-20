import requests
import psycopg2
import time

# Kết nối database Docker
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="happy_pet_shop",
    user="root",
    password="root"
)
cur = conn.cursor()

SENTIMENT_URL = "http://127.0.0.1:5000/predict"

# Lấy tất cả reviews có sentiment_label = NULL
cur.execute("SELECT id, comment FROM reviews WHERE sentiment_label IS NULL AND comment IS NOT NULL AND comment != ''")
reviews = cur.fetchall()

print(f"Total reviews to update: {len(reviews)}")

updated = 0
for review_id, comment in reviews:
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
        
        # Update database
        cur.execute(
            "UPDATE reviews SET sentiment_label = %s WHERE id = %s",
            (sentiment, review_id)
        )
        conn.commit()
        updated += 1
        print(f"  [{str(review_id)[:8]}] -> {sentiment} | {comment[:50]}")
        
    except Exception as e:
        print(f"  [{str(review_id)[:8]}] Lỗi: {e}")
        conn.rollback()
        continue

cur.close()
conn.close()
print(f"\n✅ Hoàn thành! Đã update {updated}/{len(reviews)} reviews.")
