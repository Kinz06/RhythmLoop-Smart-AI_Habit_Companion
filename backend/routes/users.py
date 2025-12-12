# backend/routes/users.py
from flask import Blueprint, request, jsonify
from models import users
from utils import hash_password, check_pw, utc_now
from flask_jwt_extended import create_access_token, decode_token
import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg":"email and password required"}), 400
    if users.find_one({"email": data['email']}):
        return jsonify({"msg":"User exists"}), 400
    user = {
        "email": data['email'],
        "password": hash_password(data['password']),
        "created_at": utc_now()
    }
    res = users.insert_one(user)
    return jsonify({"msg":"user created"}), 201

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg":"email and password required"}), 400
    u = users.find_one({"email": data['email']})
    if not u or not check_pw(u['password'], data['password']):
        return jsonify({"msg":"Bad credentials"}), 401
    access = create_access_token(identity=u['email'])
    return jsonify({"access_token": access})

@users_bp.route('/request-reset', methods=['POST'])
def request_reset():
    """
    Body: { "email": "user@example.com" }
    For demo we return the reset token in the response. In production you must send it via email.
    """
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return jsonify({"msg":"email required"}), 400
    user = users.find_one({"email": email})
    if not user:
        # don't reveal whether user exists — still return 200 for UX, but here we return msg for demo
        return jsonify({"msg":"If this email exists, reset instructions will be sent."}), 200

    # create a short-lived token for password reset (15 minutes)
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(minutes=15))
    # In a real app: send token by email (with a link to frontend reset page).
    # For demo: return token (so you can test quickly).
    return jsonify({"msg":"reset token created (demo-only)", "reset_token": token}), 200

@users_bp.route('/reset', methods=['POST'])
def reset_password():
    """
    Body: { "token": "<reset_token>", "password": "newPassword123" }
    """
    data = request.get_json() or {}
    token = data.get('token')
    new_pw = data.get('password')
    if not token or not new_pw:
        return jsonify({"msg":"token and password required"}), 400
    try:
        decoded = decode_token(token)
        # identity was the email (we stored email in create_access_token above)
        email = decoded.get("sub") or decoded.get("identity")
    except Exception as e:
        return jsonify({"msg":"Invalid or expired token", "err": str(e)}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"msg":"User not found"}), 404

    # update password (hash it)
    users.update_one({"email": email}, {"$set": {"password": hash_password(new_pw)}})
    return jsonify({"msg":"password reset successful"}), 200
