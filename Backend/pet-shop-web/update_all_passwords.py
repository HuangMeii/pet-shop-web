import psycopg2
import bcrypt

# Generate proper BCrypt hash for '123456' with 12 rounds
password = b'123456'
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)
hash_str = hashed.decode()
print(f'Generated hash: {hash_str}')

# Verify it works
assert bcrypt.checkpw(password, hashed), "Hash verification failed!"
print('Hash verified OK')

# Connect to Railway database
conn = psycopg2.connect(
    host='zephyr.proxy.rlwy.net',
    port=54229,
    user='postgres',
    password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
    dbname='railway'
)
cur = conn.cursor()

# Update ALL users (including admin) with password '123456'
cur.execute("UPDATE users SET password = %s", (hash_str,))
print(f'Updated {cur.rowcount} users')

conn.commit()
cur.close()
conn.close()
print('Done!')
