from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import habits, logs
from utils import utc_now
import datetime

habits_bp = Blueprint('habits', __name__)

@habits_bp.route('/', methods=['POST'])
@jwt_required()
def create():
    uid = get_jwt_identity()
    data = request.get_json()
    habit = {"user_id": uid, "title": data['title'], "goal": data.get('goal',1), "created_at": utc_now()}
    res = habits.insert_one(habit)
    return jsonify({"msg":"habit created"}), 201

@habits_bp.route('/', methods=['GET'])
@jwt_required()
def list_h():
    uid = get_jwt_identity()
    docs = list(habits.find({"user_id": uid}))
    for d in docs: d['_id'] = str(d['_id'])
    return jsonify(docs)

@habits_bp.route('/<hid>/log', methods=['POST'])
@jwt_required()
def log(hid):
    uid = get_jwt_identity()
    entry = {"user_id": uid, "habit_id": hid, "date": utc_now()}
    logs.insert_one(entry)
    return jsonify({"msg":"logged"}), 201
