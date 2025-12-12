from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smarthabitdb")
client = MongoClient(MONGO_URI)
db = client.get_database()
users = db.users
habits = db.habits
logs = db.logs
