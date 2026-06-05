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

# Check password hash for 0901234567
cur.execute("SELECT username, password FROM users WHERE username = '0901234567'")
row = cur.fetchone()
if row:
    print(f'Username: {row[0]}')
    print(f'Password hash: {row[1]}')
    # Test with bcrypt
    try:
        result = bcrypt.checkpw(b'123456', row[1].encode())
        print(f'Test 123456: {result}')
    except Exception as e:
        print(f'Bcrypt error: {e}')
else:
    print('User not found')

# Check all password hashes
print('\n=== ALL USERS PASSWORD CHECK ===')
cur.execute("SELECT username, password FROM users")
rows = cur.fetchall()
for r in rows:
    try:
        result = bcrypt.checkpw(b'123456', r[1].encode())
        status = 'OK' if result else 'FAIL'
    except:
        status = 'ERROR'
    print(f'{r[0]}: {status}')

cur.close()
conn.close()
