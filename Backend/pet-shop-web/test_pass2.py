import bcrypt

# Hash từ update_passwords.py
hash_update = b'$2a$12$TKZ2qbWagEgVIchdYF6Bw.x023yOYlKQC5nONnuohMe3UizQ.xvSq'

# Kiểm tra password 123456 với hash update
print('Test 123456 vs update hash:', bcrypt.checkpw(b'123456', hash_update))

# Tạo hash mới bằng BCrypt (giống Java Spring Security)
new_hash = bcrypt.hashpw(b'123456', bcrypt.gensalt(12))
print('New hash for 123456:', new_hash.decode())
print('Test new hash:', bcrypt.checkpw(b'123456', new_hash))
