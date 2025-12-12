from werkzeug.security import generate_password_hash, check_password_hash
import datetime

def hash_password(pw):
    return generate_password_hash(pw)

def check_pw(hash_pw, pw):
    return check_password_hash(hash_pw, pw)

def utc_now():
    return datetime.datetime.utcnow()
