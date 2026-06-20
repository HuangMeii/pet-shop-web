# -*- coding: utf-8 -*-
import subprocess
import json
import urllib.request
import urllib.parse

SENTIMENT_URL = "http://127.0.0.1:5000/predict"

# Lay tat ca reviews co sentiment_label = NULL
cmd = 'docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -t -A -F "|||" -c "SELECT id, comment FROM reviews WHERE sentiment_label IS NULL AND comment IS NOT NULL AND comment != \'\'"'
result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace')

lines = result.stdout.strip().split("\n")
print(f"Total reviews to update: {len(lines)}")

updated = 0
for line in lines:
    if not line.strip():
        continue
    parts = line.split("|||", 1)
    if len(parts) != 2:
        continue
    review_id = parts[0].strip()
    comment = parts[1].strip()
    
    try:
        data = json.dumps({"text": comment}).encode('utf-8')
        req = urllib.request.Request(SENTIMENT_URL, data=data, headers={'Content-Type': 'application/json'})
        resp = urllib.request.urlopen(req, timeout=10)
        sent_data = json.loads(resp.read().decode('utf-8'))
        
        label = sent_data.get("label", "")
        if "TICH CUC" in label or "positive" in label.lower():
            sentiment = "POSITIVE"
        elif "TIEU CUC" in label or "negative" in label.lower():
            sentiment = "NEGATIVE"
        else:
            sentiment = "NEUTRAL"
        
        # Update database
        update_cmd = f'docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -c "UPDATE reviews SET sentiment_label = \'{sentiment}\' WHERE id = \'{review_id}\'"'
        subprocess.run(update_cmd, shell=True, capture_output=True, encoding='utf-8', errors='replace')
        updated += 1
        print(f"  [{review_id[:8]}] -> {sentiment}")
        
    except Exception as e:
        print(f"  [{review_id[:8]}] Error: {e}")
        continue

print(f"\nDone! Updated {updated}/{len(lines)} reviews.")
