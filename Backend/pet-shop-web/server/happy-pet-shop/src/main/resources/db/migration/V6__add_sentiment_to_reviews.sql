-- ============================================================
-- V6__add_sentiment_to_reviews.sql
-- Happy Pet Shop - Add sentiment analysis columns to reviews
-- ============================================================

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS sentiment_label VARCHAR(20) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_sentiment_label ON reviews(sentiment_label);
