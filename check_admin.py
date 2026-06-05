import psycopg2
import bcrypt

conn = psycopg2.connect(
    host='zephyr.proxy.rlwy.net',
    port=54229,
    user='postgres',
    password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
    dbname='railway',
    connect_timeout=5
)
cur = conn.cursor()

# Check admin password hash
cur.execute("SELECT username, password FROM users WHERE username = 'admin'")
row = cur.fetchone()
print(f'Admin hash: {row[1][:50]}...')

# Verify with bcrypt
result = bcrypt.checkpw(b'123456', row[1].encode())
print(f'Bcrypt check: {result}')

# Check if admin has delete_at set
cur.execute("SELECT username, delete_at FROM users WHERE username = 'admin'")
row = cur.fetchone()
print(f'delete_at: {row[1]}')

cur.close()
conn.close()
