import bcrypt

# The hash from V2 seed data for admin
hash_v2 = b"$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu"

# Test if Asdf1234! matches
result = bcrypt.checkpw(b"Asdf1234!", hash_v2)
print(f"Hash from V2 matches 'Asdf1234!': {result}")

# Also test with 123456
result2 = bcrypt.checkpw(b"123456", hash_v2)
print(f"Hash from V2 matches '123456': {result2}")

# Generate a new hash for Asdf1234! to compare
new_hash = bcrypt.hashpw(b"Asdf1234!", bcrypt.gensalt(12))
print(f"New hash for 'Asdf1234!': {new_hash.decode()}")
