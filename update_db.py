import psycopg2
import bcrypt

# Generate hash
password = b'123456'
salt = bcrypt.gensalt(rounds=12, prefix=b'2a')
hashed = bcrypt.hashpw(password, salt)
hash_str = hashed.decode()

# Verify
assert bcrypt.checkpw(password, hashed), "FAIL"
print("Generated hash:", hash_str)

# Update DB
conn = psycopg2.connect(
    host='zephyr.proxy.rlwy.net',
    port=54229,
    user='postgres',
    password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
    dbname='railway'
)
cur = conn.cursor()
cur.execute("UPDATE users SET password = %s", (hash_str,))
print("Updated:", cur.rowcount)
conn.commit()

# Verify
cur.execute("SELECT username, password FROM users WHERE username = 'admin'")
row = cur.fetchone()
print("Stored hash:", repr(row[1]))
print("Match:", row[1] == hash_str)

cur.close()
conn.close()
