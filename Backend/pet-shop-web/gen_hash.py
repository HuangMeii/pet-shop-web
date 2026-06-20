import bcrypt
import sys

password = b'123456'
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)
hash_str = hashed.decode()

# Verify
assert bcrypt.checkpw(password, hashed), "FAIL"

# Write to file
with open('hash_output.txt', 'w') as f:
    f.write(hash_str)

print("SUCCESS: " + hash_str)
sys.stdout.flush()
