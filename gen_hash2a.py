import bcrypt
import sys

password = b'123456'
salt = bcrypt.gensalt(rounds=12, prefix=b'2a')
hashed = bcrypt.hashpw(password, salt)
hash_str = hashed.decode()

# Verify
assert bcrypt.checkpw(password, hashed), "FAIL"

print("SUCCESS: " + hash_str)
sys.stdout.flush()
