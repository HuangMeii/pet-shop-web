import psycopg2
import sys

# Railway connection string
DATABASE_URL = "postgresql://postgres:XJBfABHcDIcPVfYmsxnplWaopaqjgGDl@zephyr.proxy.rlwy.net:54229/railway"

# Parse connection string
# postgresql://user:password@host:port/dbname
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

print(f"Connecting to {conn_params['host']}:{conn_params['port']}/{conn_params['dbname']}...")

try:
    conn = psycopg2.connect(**conn_params)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Read SQL file
    with open(r"D:\MyData\Disk D\HocKi6\Java\happypetshop\export_202605100827.sql", "r", encoding="utf-8") as f:
        sql_content = f.read()
    
    # Split by semicolons and execute each statement
    statements = sql_content.split(";")
    total = len(statements)
    success = 0
    
    for i, stmt in enumerate(statements):
        stmt = stmt.strip()
        if stmt and not stmt.startswith("--"):
            try:
                cur.execute(stmt)
                success += 1
                if i % 10 == 0:
                    print(f"Progress: {i}/{total}")
            except Exception as e:
                print(f"Error at statement {i}: {e}")
                print(f"Statement: {stmt[:100]}...")
    
    print(f"\nDone! {success}/{total} statements executed successfully.")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Connection error: {e}")
    sys.exit(1)
