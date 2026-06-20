import bcrypt
import subprocess

# Generate ONE hash for all users
h = bcrypt.hashpw(b'123456', bcrypt.gensalt(12)).decode()
print("New hash:", h)

# Verify it works
assert bcrypt.checkpw(b'123456', h.encode()), "Hash verification failed!"
print("Hash verified OK")

# Users to update (except 0901234567 and admin which are already updated)
users = [
    '0161304961', '0161304968', '0901234565',
    '0911111111', '0912345678', '0912345679',
    '0916114536', '0916114537', '0933333333',
    '0944444444', '0955555555', '0999999998',
    '0999999999'
]

for u in users:
    cmd = [
        'docker', 'exec', 'happy-pet-shop-db', 'psql',
        '-U', 'root', '-d', 'happy_pet_shop', '-c',
        "UPDATE users SET password = '{}' WHERE username = '{}';".format(h, u)
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print("{}: {}".format(u, r.stdout.strip()))

print("Done!")
