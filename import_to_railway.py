import psycopg2
import sys
import os

DATABASE_URL = "postgresql://postgres:XJBfABHcDIcPVfYmsxnplWaopaqjgGDl@zephyr.proxy.rlwy.net:54229/railway"

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

print(f"Connecting to {conn_params['host']}:{conn_params['port']}/{conn_params['dbname']}...")

try:
    conn = psycopg2.connect(**conn_params)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Read init.sql
    init_path = os.path.join(BASE_DIR, "server", "happy-pet-shop", "db", "init.sql")
    with open(init_path, "r", encoding="utf-8") as f:
        sql_content = f.read()
    
    # Split by semicolons
    statements = sql_content.split(";")
    
    # Clean statements: remove leading comments and whitespace
    clean_stmts = []
    for stmt in statements:
        s = stmt.strip()
        if not s:
            continue
        # Remove leading comment lines
        lines = s.split("\n")
        clean_lines = [l for l in lines if not l.strip().startswith("--")]
        s = " ".join(clean_lines).strip()
        if s:
            clean_stmts.append(s)
    
    # First pass: CREATE TABLE statements only
    print("\n=== Creating tables ===")
    table_count = 0
    for s in clean_stmts:
        if s.upper().startswith("CREATE TABLE"):
            try:
                cur.execute(s)
                table_count += 1
                # Extract table name
                parts = s.split()
                if len(parts) >= 3:
                    print(f"  Created: {parts[2]}")
            except Exception as e:
                print(f"  Error creating table: {str(e)[:150]}")
    
    print(f"  Created {table_count} tables")
    
    # Second pass: CREATE INDEX statements
    print("\n=== Creating indexes ===")
    index_count = 0
    for s in clean_stmts:
        if s.upper().startswith("CREATE INDEX") or s.upper().startswith("CREATE UNIQUE INDEX"):
            try:
                cur.execute(s)
                index_count += 1
            except Exception as e:
                pass  # Index errors are usually harmless
    
    print(f"  Created {index_count} indexes")
    
    # Third pass: INSERT statements
    print("\n=== Inserting data ===")
    insert_count = 0
    for s in clean_stmts:
        if s.upper().startswith("INSERT"):
            try:
                cur.execute(s)
                insert_count += 1
            except Exception as e:
                print(f"  Error inserting: {str(e)[:150]}")
    
    print(f"  Executed {insert_count} inserts")
    
    # Verify
    print("\n=== Verification ===")
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
    tables = cur.fetchall()
    print(f"Tables: {len(tables)}")
    for t in tables:
        cur.execute(f"SELECT COUNT(*) FROM {t[0]}")
        count = cur.fetchone()[0]
        print(f"  - {t[0]}: {count} rows")
    
    cur.close()
    conn.close()
    print("\nDone!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
