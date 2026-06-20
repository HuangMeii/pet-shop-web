"""
Script insert dữ liệu reviews mẫu vào database Docker local
Kết nối đến localhost:5432, user: root, pass: root, db: happy_pet_shop
"""
import psycopg2
from datetime import datetime, timedelta
import random

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "user": "root",
    "password": "root",
    "dbname": "happy_pet_shop",
}

# Product IDs từ database Docker local
PRODUCT_IDS = [
    "c3aaf119-9794-4891-a80b-680cf14b658e",  # Royal Canin Mini Adult 2kg
    "29cb5511-7db7-43c5-8ae3-550f362c57f6",  # dien thoai cho cho
    "96933adb-6487-4899-8872-da4e7cec6c05",  # Lavender Clumping Cat Litter 10L
    "0fee9909-5030-4653-89d9-ef00dcb62cec",  # Whiskas Adult Tuna 1.2kg
    "57752647-1d1f-4914-8bd4-12d994c09bb5",  # Royal Canin Mini Adult 2kg
    "0b231149-7ee5-441c-bd6c-be71c74f8a30",  # Test product
    "0efbf7b4-fe1b-4564-885e-25d05cdcfed8",  # Rubber Bone Dog Toy11
]

# Customer IDs từ database Docker local
CUSTOMER_IDS = [
    "ba5df993-5e43-4c10-9faf-6c0b63f1ead2",
    "0cf0c9a3-3410-492a-802c-4efe708fd478",
    "7a449c4f-3251-4282-974d-8ea2e0cce313",
    "5c61e765-bbb3-4860-ac4b-c3a0cd672d95",
    "f1abd538-90a4-4774-8aca-494de63f132c",
    "3cda06e7-1055-4da2-9864-5c392bee3c4c",
    "9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b",
    "9454a904-6fb5-4298-9f12-8eb6e9740c1a",
    "6b2346f7-f3a7-45ad-8adb-dcb657fc1c6d",
]

# 20 reviews mẫu - KHÔNG gán sentiment_label (để server tự xử lý)
SAMPLE_REVIEWS = [
    # Rating 5 - Tích cực
    (5, "Sản phẩm rất tốt, chó nhà mình rất thích ăn. Đóng gói cẩn thận, giao hàng nhanh."),
    (5, "Chất lượng tuyệt vời! Mèo nhà mình ăn rất ngon miệng, sẽ mua lại."),
    (4, "Hàng đẹp, đúng mô tả. Giá cả hợp lý, ship nhanh trong 2 ngày."),
    (5, "Rất hài lòng với sản phẩm. Chó nhỏ nhà mình rất thích đồ chơi này."),
    (4, "Cát vệ sinh thơm, khử mùi tốt. Sẽ ủng hộ shop dài dài."),
    (5, "Thức ăn chất lượng cao, pet nhà mình lông mượt hơn hẳn."),
    (4, "Giao hàng nhanh, đóng gói kỹ. Sản phẩm như hình, rất đáng mua."),
    (5, "Mua lần thứ 3 rồi, chất lượng vẫn rất tốt. Shop uy tín!"),
    (4, "Sản phẩm tốt, giá cả phải chăng. Nhân viên tư vấn nhiệt tình."),
    (5, "Cún nhà mình mê món này lắm, ăn hết veo. Cảm ơn shop!"),
    # Rating 3 - Trung tính
    (3, "Sản phẩm tạm được, không có gì đặc biệt. Giao hàng hơi chậm."),
    (3, "Chất lượng bình thường, giá hơi cao so với thị trường."),
    (3, "Cũng được, pet nhà mình ăn được nhưng không quá thích."),
    (2, "Hàng không giống hình lắm, nhưng dùng tạm được."),
    (3, "Đóng gói cẩn thận nhưng giao hàng hơi lâu."),
    # Rating 1-2 - Tiêu cực
    (1, "Sản phẩm kém chất lượng, pet nhà mình bị dị ứng sau khi dùng."),
    (2, "Hàng nhận bị hư hỏng do đóng gói không kỹ. Không hài lòng."),
    (1, "Thất vọng! Sản phẩm không như quảng cáo, không đáng tiền."),
    (2, "Giao hàng quá chậm, phải đợi gần 1 tuần mới nhận được."),
    (1, "Mùi hôi khó chịu, pet nhà mình không dùng được. Phí tiền."),
]

def seed_reviews():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Delete old data
    cur.execute("DELETE FROM review_images")
    cur.execute("DELETE FROM reviews")
    conn.commit()
    print("Deleted old review data")

    now = datetime.now()
    inserted = 0

    for rating, comment in SAMPLE_REVIEWS:
        product_id = random.choice(PRODUCT_IDS)
        customer_id = random.choice(CUSTOMER_IDS)
        # Tạo created_at ngẫu nhiên trong 30 ngày gần đây
        created_at = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))

        cur.execute("""
            INSERT INTO reviews (product_id, customer_id, rating, comment, sentiment_label, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NULL, %s, %s)
        """, (product_id, customer_id, rating, comment, created_at, created_at))
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"Inserted {inserted} reviews successfully!")

if __name__ == "__main__":
    seed_reviews()
