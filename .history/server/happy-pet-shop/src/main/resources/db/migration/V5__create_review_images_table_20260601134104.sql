-- ============================================================
-- V5__create_review_images_table.sql
-- Happy Pet Shop - Review Images Table
-- ============================================================

CREATE TABLE IF NOT EXISTS review_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);
