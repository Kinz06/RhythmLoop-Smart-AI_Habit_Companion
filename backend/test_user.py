from models import users
from utils import hash_password

email = "kawinraj06@gmail.com"
password = "1234"

if users.find_one({"email": email}):
    print("User already exists:", email)
else:
    users.insert_one({
        "email": email,
        "password": hash_password(password)
    })
    print("Inserted test user:", email, "password:", password)
