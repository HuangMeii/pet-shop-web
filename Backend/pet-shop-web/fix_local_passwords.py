import psycopg2
import bcrypt

# Hash đúng của "123456" (lấy từ init.sql)
CORRECT_HASH = "$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu"

# Verify hash đúng
password = "123456".encode("utf-8")
if bcrypt.checkpw(password, CORRECT_HASH.encode("utf-8")):
    print("Hash CORRECT_HASH is valid for password '123456'")
else:
    print("ERROR: CORRECT_HASH is NOT valid for password '123456'")
    # Generate new hash
    salt = bcrypt.gensalt(rounds=12)
    new_hash = bcrypt.hashpw(password, salt).decode("utf-8")
    print(f"Generated new hash: {new_hash}")
    CORRECT_HASH = new_hash

# Connect to local Docker database
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    user="root",
    password="root",
    database="happy_pet_shop"
)
cur = conn.cursor()

# Update all users with the correct hash
cur.execute("UPDATE users SET password = %s", (CORRECT_HASH,))
updated = cur.rowcount
conn.commit()
print(f"Updated {updated} users with correct password hash")

# Verify
cur.execute("SELECT username, password FROM users ORDER BY username")
rows = cur.fetchall()
for row in rows:
    print(f"  {row[0]}: {row[1][:30]}...")

cur.close()
conn.close()
print("Done!")
