# -*- coding: utf-8 -*-
import subprocess

# Update sentiment_label based on rating
# Rating 1-2 -> NEGATIVE, Rating 3 -> NEUTRAL, Rating 4-5 -> POSITIVE
cmd = '''
docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -c "
UPDATE reviews SET sentiment_label = 
  CASE 
    WHEN rating >= 4 THEN 'POSITIVE'
    WHEN rating <= 2 THEN 'NEGATIVE'
    ELSE 'NEUTRAL'
  END
WHERE sentiment_label IS NULL OR sentiment_label = 'NEUTRAL';
"
'''
result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace')
print(result.stdout)
print(result.stderr)

# Verify
cmd2 = "docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -c \"SELECT rating, sentiment_label, COUNT(*) FROM reviews GROUP BY rating, sentiment_label ORDER BY rating\""
result2 = subprocess.run(cmd2, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace')
print("=== Verification ===")
print(result2.stdout)
