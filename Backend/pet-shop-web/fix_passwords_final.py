import psycopg2
import bcrypt

# Generate proper BCrypt hash for '123456' with 12 rounds
password = b'123456'
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)
hash_str = hashed.decode()
print(f'Generated hash: {hash_str}')

# Verify it works with bcrypt
assert bcrypt.checkpw(password, hashed), "Hash verification failed!"
print('Hash verified OK with bcrypt')

# Also verify with the hash format Spring Security uses
# Spring Security uses $2a$ format which is compatible
print(f'Hash starts with $2a$: {hash_str.startswith("$2a$")}')

# Connect to Railway database
conn = psycopg2.connect(
    host='zephyr.proxy.rlwy.net',
    port=54229,
    user='postgres',
    password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
    dbname='railway'
)
cur = conn.cursor()

# Update ALL users with password '123456'
cur.execute("UPDATE users SET password = %s", (hash_str,))
print(f'Updated {cur.rowcount} users')

conn.commit()

# Verify the update
cur.execute("SELECT username, password FROM users WHERE username = 'admin'")
row = cur.fetchone()
print(f'Admin hash in DB: {row[1]}')
print(f'Hash matches: {row[1] == hash_str}')

cur.close()
conn.close()
print('Done!')
