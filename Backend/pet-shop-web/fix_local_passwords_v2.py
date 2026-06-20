import psycopg2
import bcrypt

# Generate hash with $2a$ prefix (compatible with Java Spring Security)
password = "123456".encode("utf-8")
salt = bcrypt.gensalt(rounds=12, prefix=b"2a")
new_hash = bcrypt.hashpw(password, salt).decode("utf-8")
print(f"Generated hash: {new_hash}")

# Verify
if bcrypt.checkpw(password, new_hash.encode("utf-8")):
    print("Hash verified OK!")
else:
    print("ERROR: Hash verification failed!")
    exit(1)

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
cur.execute("UPDATE users SET password = %s", (new_hash,))
updated = cur.rowcount
conn.commit()
print(f"Updated {updated} users with correct password hash ($2a$)")

# Verify
cur.execute("SELECT username, password FROM users ORDER BY username")
rows = cur.fetchall()
for row in rows:
    print(f"  {row[0]}: {row[1][:35]}...")

cur.close()
conn.close()
print("Done!")
