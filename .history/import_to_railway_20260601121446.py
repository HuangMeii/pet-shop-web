import psycopg2
import sys
import os

# Railway connection string
DATABASE_URL = "postgresql://postgres:XJBfABHcDIcPVfYmsxnplWaopaqjgGDl@zephyr.proxy.rlwy.net:54229/railway"

# Parse connection string
parts = DATABASE_URL.replace("postgresql://", "").split("@")
user_pass = parts[0].split(":")
host_port_db = parts[1].split("/")
host_port = host_port_db[0].split(":")

conn_params = {
    "user": user_pass[0],
    "password": user_pass[1],
    "host": host_port[0],
    "port": int(host_port[1]),
    "dbname": host_port_db[1],
}

BASE_DIR = r"D:\MyData\Disk D\HocKi6\Java\happypetshop"

def execute_sql_file(conn, filepath, description):
    print(f"\n=== Executing {description}: {os.path.basename(filepath)} ===")
    with open(filepath, "r", encoding="utf-8") as f:
        sql_content = f.read()
    
    statements = sql_content.split(";")
    total = len(statements)
    success = 0
    errors = 0
    
    for i, stmt in enumerate(statements):
        stmt = stmt.strip()
        if stmt and not stmt.startswith("--"):
            try:
                conn.cursor().execute(stmt)
                success += 1
            except Exception as e:
                errors += 1
                if errors <= 3:
                    print(f"  Error at statement {i}: {e}")
    
    print(f"  Result: {success} success, {errors} errors out of {total} statements")
    return errors == 0 or success > 0

print(f"Connecting to {conn_params['host']}:{conn_params['port']}/{conn_params['dbname']}...")

try:
    conn = psycopg2.connect(**conn_params)
    conn.autocommit = True
    
    # Use db/init.sql which has CREATE TABLE IF NOT EXISTS + seed data
    init_path = os.path.join(BASE_DIR, "server", "happy-pet-shop", "db", "init.sql")
    execute_sql_file(conn, init_path, "INIT DATABASE")
    
    print("\n=== Import completed successfully! ===")
    
    # Verify
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    tables = cur.fetchall()
    print(f"\nTables in database: {len(tables)}")
    for t in tables:
        cur.execute(f"SELECT COUNT(*) FROM {t[0]}")
        count = cur.fetchone()[0]
        print(f"  - {t[0]}: {count} rows")
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
