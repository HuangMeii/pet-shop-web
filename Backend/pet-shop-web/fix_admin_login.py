"""
Fix admin login by updating passwords with BCrypt hash compatible with Spring Security.
Spring Security's BCryptPasswordEncoder uses $2a$ prefix.
Python's bcrypt library generates $2b$ prefix by default, but we can use $2a$ instead.
"""
import bcrypt
import psycopg2
import os

# Database connection from .env
DB_URL = "jdbc:postgresql://zephyr.proxy.rlwy.net:54229/railway?TimeZone=UTC&connectionTimeZone=UTC"
DB_USER = "postgres"
DB_PASS = "XJBfABHcDIcPVfYmsxnplWaopaqjgGDl"

# Parse JDBC URL to get host, port, dbname
# jdbc:postgresql://zephyr.proxy.rlwy.net:54229/railway
parts = DB_URL.replace("jdbc:postgresql://", "").split("/")
host_port = parts[0]
dbname = parts[1].split("?")[0]
host = host_port.split(":")[0]
port = int(host_port.split(":")[1])

def generate_bcrypt_hash(password: str, rounds: int = 12) -> str:
    """Generate BCrypt hash compatible with Spring Security ($2a$ prefix)."""
    salt = bcrypt.gensalt(rounds=rounds)
    # Replace $2b$ with $2a$ to match Spring Security format
    hash_str = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    hash_str = hash_str.replace('$2b$', '$2a$')
    return hash_str

def main():
    # Generate hashes
    admin_password = "Asdf1234!"
    user_password = "123456"
    
    admin_hash = generate_bcrypt_hash(admin_password)
    user_hash = generate_bcrypt_hash(user_password)
    
    print(f"Admin hash ({admin_password}): {admin_hash}")
    print(f"User hash ({user_password}): {user_hash}")
    
    # Verify the hashes work with bcrypt
    assert bcrypt.checkpw(admin_password.encode('utf-8'), admin_hash.encode('utf-8')), "Admin hash verification failed!"
    assert bcrypt.checkpw(user_password.encode('utf-8'), user_hash.encode('utf-8')), "User hash verification failed!"
    print("Hash verification passed!")
    
    # Connect to database and update passwords
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            dbname=dbname,
            user=DB_USER,
            password=DB_PASS,
            sslmode='require'
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Update admin password
        cur.execute(
            "UPDATE users SET password = %s WHERE username = 'admin'",
            (admin_hash,)
        )
        print(f"Updated admin password: {cur.rowcount} row(s)")
        
        # Update all other users
        cur.execute(
            "UPDATE users SET password = %s WHERE username != 'admin'",
            (user_hash,)
        )
        print(f"Updated user passwords: {cur.rowcount} row(s)")
        
        # Verify
        cur.execute("SELECT username, password FROM users WHERE username = 'admin'")
        row = cur.fetchone()
        print(f"\nAdmin in DB: username={row[0]}, hash={row[1][:30]}...")
        
        cur.execute("SELECT COUNT(*) FROM users")
        print(f"Total users: {cur.fetchone()[0]}")
        
        cur.close()
        conn.close()
        print("\n✅ Passwords updated successfully!")
        print(f"   Admin login: username='admin', password='{admin_password}'")
        print(f"   User login: username=<phone>, password='{user_password}'")
        
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    main()
