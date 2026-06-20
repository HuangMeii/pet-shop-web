import psycopg2

try:
    conn = psycopg2.connect(
        host='zephyr.proxy.rlwy.net',
        port=54229,
        user='postgres',
        password='XJBfABHcDIcPVfYmsxnplWaopaqjgGDl',
        dbname='railway',
        connect_timeout=5
    )
    cur = conn.cursor()
    
    # List tables
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
    tables = cur.fetchall()
    print("=== TABLES ===")
    for t in tables:
        print(t[0])
    
    # Check users table
    print("\n=== USERS ===")
    cur.execute("SELECT id, username, phone FROM users ORDER BY id")
    rows = cur.fetchall()
    for r in rows:
        print(f'ID: {r[0]}, Username: {r[1]}, Phone: {r[2]}')
    print(f'Total: {len(rows)} users')
    
    cur.close()
    conn.close()
except Exception as e:
    print(f'Error: {e}')
