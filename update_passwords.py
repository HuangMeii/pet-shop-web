import psycopg2

conn = psycopg2.connect(
    host='zephyr.proxy.rlwy.net',
    port=54229,
    user='postgres',
    password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
    dbname='railway'
)
cur = conn.cursor()
# BCrypt hash of '123456' with strength 12
new_hash = '$2a$12$TKZ2qbWagEgVIchdYF6Bw.x023yOYlKQC5nONnuohMe3UizQ.xvSq'
cur.execute("UPDATE users SET password = %s WHERE username != 'admin'", (new_hash,))
print(f'Updated {cur.rowcount} rows')
conn.commit()
cur.close()
conn.close()
