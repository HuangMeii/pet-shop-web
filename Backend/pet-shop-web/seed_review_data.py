import psycopg2
from psycopg2.extras import execute_values

# Database connection from .env
DB_URL = "jdbc:postgresql://zephyr.proxy.rlwy.net:54229/railway?TimeZone=UTC&connectionTimeZone=UTC"
DB_USER = "postgres"
DB_PASSWORD = "XJBfABHcDIcPVfYmsxnplWaopaqjgGDl"

# Parse JDBC URL to get host, port, dbname
import re
match = re.match(r'jdbc:postgresql://([^:]+):(\d+)/([^?]+)', DB_URL)
host = match.group(1)
port = int(match.group(2))
dbname = match.group(3)

print(f"Connecting to {host}:{port}/{dbname}...")

conn = psycopg2.connect(
    host=host,
    port=port,
    dbname=dbname,
    user=DB_USER,
    password=DB_PASSWORD,
    sslmode='require'
)
conn.autocommit = True
cur = conn.cursor()

# Check if reviews table exists
cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews')")
if not cur.fetchone()[0]:
    print("ERROR: reviews table does not exist! Run Flyway migrations first.")
    cur.close()
    conn.close()
    exit(1)

# Check if data already exists
cur.execute("SELECT COUNT(*) FROM reviews")
count = cur.fetchone()[0]
if count > 0:
    print(f"Reviews table already has {count} records. Skipping insert.")
    cur.close()
    conn.close()
    exit(0)

print("Inserting review data...")

# Reviews data
reviews = [
    # 1. Royal Canin Mini Adult - Positive
    ('a1000001-0000-4000-8000-000000000001', '57752647-1d1f-4914-8bd4-12d994c09bb5', 'ba5df993-5e43-4c10-9faf-6c0b63f1ead2', 5,
     'Thức ăn rất tốt, chó nhà mình ăn rất thích, lông mượt hơn hẳn. Sẽ mua tiếp!', 'POSITIVE',
     '2026-03-10 08:30:00', '2026-03-10 08:30:00'),
    # 2. Royal Canin Mini Adult - Positive
    ('a1000001-0000-4000-8000-000000000002', '57752647-1d1f-4914-8bd4-12d994c09bb5', '0cf0c9a3-3410-492a-802c-4efe708fd478', 4,
     'Chất lượng tốt, đóng gói cẩn thận. Giá hơi cao nhưng xứng đáng.', 'POSITIVE',
     '2026-03-15 14:20:00', '2026-03-15 14:20:00'),
    # 3. Royal Canin Mini Adult - Neutral
    ('a1000001-0000-4000-8000-000000000003', '57752647-1d1f-4914-8bd4-12d994c09bb5', '7a449c4f-3251-4282-974d-8ea2e0cce313', 3,
     'Sản phẩm bình thường, chó mình ăn được nhưng không quá thích. Có thể mua lại.', 'NEUTRAL',
     '2026-03-20 10:00:00', '2026-03-20 10:00:00'),
    # 4. Lavender Cat Litter - Positive
    ('a1000001-0000-4000-8000-000000000004', '96933adb-6487-4899-8872-da4e7cec6c05', '5c61e765-bbb3-4860-ac4b-c3a0cd672d95', 5,
     'Cát vệ sinh thơm mùi oải hương dễ chịu, khử mùi rất tốt. Mèo nhà mình rất thích!', 'POSITIVE',
     '2026-03-12 09:15:00', '2026-03-12 09:15:00'),
    # 5. Lavender Cat Litter - Positive
    ('a1000001-0000-4000-8000-000000000005', '96933adb-6487-4899-8872-da4e7cec6c05', 'f1abd538-90a4-4774-8aca-494de63f132c', 4,
     'Dùng tốt, vón cục nhanh, không bụi. Giá hợp lý.', 'POSITIVE',
     '2026-03-18 16:45:00', '2026-03-18 16:45:00'),
    # 6. Lavender Cat Litter - Negative
    ('a1000001-0000-4000-8000-000000000006', '96933adb-6487-4899-8872-da4e7cec6c05', '3cda06e7-1055-4da2-9864-5c392bee3c4c', 2,
     'Không như mong đợi, mùi hơi gắt, mèo nhà mình không chịu dùng. Hơi thất vọng.', 'NEGATIVE',
     '2026-03-25 11:30:00', '2026-03-25 11:30:00'),
    # 7. Whiskas Adult Tuna - Positive
    ('a1000001-0000-4000-8000-000000000007', '0fee9909-5030-4653-89d9-ef00dcb62cec', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', 5,
     'Mèo nhà mình nghiện món này luôn! Ăn rất ngon miệng, giá lại rẻ.', 'POSITIVE',
     '2026-03-08 07:00:00', '2026-03-08 07:00:00'),
    # 8. Whiskas Adult Tuna - Neutral
    ('a1000001-0000-4000-8000-000000000008', '0fee9909-5030-4653-89d9-ef00dcb62cec', 'ba5df993-5e43-4c10-9faf-6c0b63f1ead2', 3,
     'Tạm được, mèo ăn được nhưng không quá hào hứng. Hàng giao đúng hạn.', 'NEUTRAL',
     '2026-03-22 13:00:00', '2026-03-22 13:00:00'),
    # 9. Rubber Bone Dog Toy - Positive
    ('a1000001-0000-4000-8000-000000000009', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', '0cf0c9a3-3410-492a-802c-4efe708fd478', 5,
     'Đồ chơi rất bền, chó nhà mình gặm mãi không hỏng. Chất lượng cao!', 'POSITIVE',
     '2026-04-01 10:30:00', '2026-04-01 10:30:00'),
    # 10. Rubber Bone Dog Toy - Positive
    ('a1000001-0000-4000-8000-000000000010', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', '7a449c4f-3251-4282-974d-8ea2e0cce313', 4,
     'Chất lượng tốt, màu sắc đẹp. Chó nhỏ gặm vừa vặn.', 'POSITIVE',
     '2026-04-05 15:00:00', '2026-04-05 15:00:00'),
    # 11. Rubber Bone Dog Toy - Negative
    ('a1000001-0000-4000-8000-000000000011', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', '5c61e765-bbb3-4860-ac4b-c3a0cd672d95', 1,
     'Sản phẩm kém chất lượng, chó gặm một lúc đã vỡ. Không nên mua!', 'NEGATIVE',
     '2026-04-10 09:00:00', '2026-04-10 09:00:00'),
    # 12. dien thoai cho cho - Positive
    ('a1000001-0000-4000-8000-000000000012', '29cb5511-7db7-43c5-8ae3-550f362c57f6', 'f1abd538-90a4-4774-8aca-494de63f132c', 4,
     'Sản phẩm thú vị, chó nhà mình chơi suốt ngày. Giao hàng nhanh.', 'POSITIVE',
     '2026-04-08 11:20:00', '2026-04-08 11:20:00'),
    # 13. dien thoai cho cho - Neutral
    ('a1000001-0000-4000-8000-000000000013', '29cb5511-7db7-43c5-8ae3-550f362c57f6', '3cda06e7-1055-4da2-9864-5c392bee3c4c', 3,
     'Bình thường, không có gì đặc biệt. Chó chơi được vài ngày rồi chán.', 'NEUTRAL',
     '2026-04-15 08:00:00', '2026-04-15 08:00:00'),
    # 14. Royal Canin Mini Adult (English) - Positive
    ('a1000001-0000-4000-8000-000000000014', 'c3aaf119-9794-4891-a80b-680cf14b658e', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', 5,
     'Great food! My dog loves it. Coat is shinier and digestion improved.', 'POSITIVE',
     '2026-04-12 12:00:00', '2026-04-12 12:00:00'),
    # 15. Test product - Negative
    ('a1000001-0000-4000-8000-000000000015', '0b231149-7ee5-441c-bd6c-be71c74f8a30', 'ba5df993-5e43-4c10-9faf-6c0b63f1ead2', 1,
     'Sản phẩm không như mô tả, chất lượng rất tệ. Không đáng tiền chút nào.', 'NEGATIVE',
     '2026-04-18 14:30:00', '2026-04-18 14:30:00'),
    # 16. Test product - Negative
    ('a1000001-0000-4000-8000-000000000016', '0b231149-7ee5-441c-bd6c-be71c74f8a30', '0cf0c9a3-3410-492a-802c-4efe708fd478', 2,
     'Chất lượng trung bình, không ấn tượng. Giao hàng hơi chậm.', 'NEGATIVE',
     '2026-04-20 16:00:00', '2026-04-20 16:00:00'),
    # 17. Whiskas Adult Tuna - Positive
    ('a1000001-0000-4000-8000-000000000017', '0fee9909-5030-4653-89d9-ef00dcb62cec', '7a449c4f-3251-4282-974d-8ea2e0cce313', 4,
     'Mèo nhà mình thích lắm, ăn hết veo. Sẽ ủng hộ shop dài dài!', 'POSITIVE',
     '2026-04-25 09:45:00', '2026-04-25 09:45:00'),
    # 18. Lavender Cat Litter - Positive
    ('a1000001-0000-4000-8000-000000000018', '96933adb-6487-4899-8872-da4e7cec6c05', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', 5,
     'Từ ngày dùng cát này nhà không còn mùi hôi nữa. Rất hài lòng!', 'POSITIVE',
     '2026-05-01 10:00:00', '2026-05-01 10:00:00'),
    # 19. Royal Canin Mini Adult - Neutral
    ('a1000001-0000-4000-8000-000000000019', '57752647-1d1f-4914-8bd4-12d994c09bb5', 'f1abd538-90a4-4774-8aca-494de63f132c', 3,
     'Cũng được, chó ăn không thay đổi nhiều. Hàng giao đúng hạn, đóng gói cẩn thận.', 'NEUTRAL',
     '2026-05-05 15:30:00', '2026-05-05 15:30:00'),
    # 20. Rubber Bone Dog Toy - Positive
    ('a1000001-0000-4000-8000-000000000020', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', '3cda06e7-1055-4da2-9864-5c392bee3c4c', 4,
     'Mua cho chó Pitbull chơi rất bền, không bị xé rách. Đáng tiền!', 'POSITIVE',
     '2026-05-08 08:00:00', '2026-05-08 08:00:00'),
]

# Insert reviews
review_sql = """
    INSERT INTO reviews (id, product_id, customer_id, rating, comment, sentiment_label, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
"""
for r in reviews:
    cur.execute(review_sql, r)

print(f"Inserted {len(reviews)} reviews!")

# Insert review images
review_images = [
    ('b2000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001',
     'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774371478/lydci47lq2n3sudyjo4d.png', 0),
    ('b2000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000004',
     'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1773047013/vfxxtauixyhmifv1vube.jpg', 0),
    ('b2000001-0000-4000-8000-000000000003', 'a1000001-0000-4000-8000-000000000009',
     'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', 0),
    ('b2000001-0000-4000-8000-000000000004', 'a1000001-0000-4000-8000-000000000018',
     'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1773047013/vfxxtauixyhmifv1vube.jpg', 0),
]

# Check if review_images table exists
cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_images')")
if cur.fetchone()[0]:
    image_sql = """
        INSERT INTO review_images (id, review_id, image_url, sort_order)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """
    for img in review_images:
        cur.execute(image_sql, img)
    print(f"Inserted {len(review_images)} review images!")
else:
    print("review_images table does not exist, skipping images.")

cur.close()
conn.close()
print("Done! Data inserted successfully.")
