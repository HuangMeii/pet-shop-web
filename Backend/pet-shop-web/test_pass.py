import bcrypt

# Hash từ V2 seed data (dùng BCryptPasswordEncoder của Java)
hash_v2 = b'$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu'
# Hash mới tạo từ V3 (pgcrypto crypt)
hash_v3 = b'$2b$12$l0ioq7qg08ysbTxJ6j7l5e9ibx8MxD70IWeM.R/iRDomJg4TSFV12'

# Kiểm tra password 123456 với hash V2
print('Test 123456 vs V2 hash:', bcrypt.checkpw(b'123456', hash_v2))
print('Test 123456 vs V3 hash:', bcrypt.checkpw(b'123456', hash_v3))

# Tạo hash mới cho 123456 bằng BCrypt (giống Java)
new_hash = bcrypt.hashpw(b'123456', bcrypt.gensalt(12))
print('New hash for 123456:', new_hash.decode())
print('Test new hash:', bcrypt.checkpw(b'123456', new_hash))
