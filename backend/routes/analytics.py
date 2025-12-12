from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import logs
import datetime
from collections import defaultdict
from flask import request
import datetime
import joblib
import os

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/streaks', methods=['GET'])
@jwt_required()
def streaks():
    uid = get_jwt_identity()
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    docs = list(logs.find({"user_id": uid, "date": {"$gte": cutoff}}))
    per = defaultdict(set)
    for d in docs:
        per[d['habit_id']].add(d['date'].date())
    res = {hid: len(days) for hid, days in per.items()}
    return jsonify(res)

@analytics_bp.route('/predict', methods=['GET'])
@jwt_required()
def predict():
    uid = get_jwt_identity()
    days = int(request.args.get('days', 14))
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=days)
    docs = list(logs.find({"user_id": uid, "date": {"$gte": cutoff}}))
    total = len(docs)
    unique = len(set(d['habit_id'] for d in docs))
    dates_set = set(d['date'].date() for d in docs)
    # current streak
    streak = 0
    d = datetime.datetime.utcnow().date()
    while d in dates_set:
        streak += 1
        d = d - datetime.timedelta(days=1)
    avg_per_day = total / max(1, days)

    # try ML model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'model.pkl')
    prediction = None
    prob = None
    if os.path.exists(model_path):
        try:
            clf = joblib.load(model_path)
            X = [[total, unique, streak, avg_per_day]]
            pred = int(clf.predict(X)[0])
            proba = clf.predict_proba(X).max() if hasattr(clf, "predict_proba") else None
            prediction = {0: "low", 1: "medium", 2: "high"}.get(pred, "unknown")
            prob = float(proba) if proba is not None else None
        except Exception as e:
            # fallback to rule-based
            prediction = None

    if not prediction:
        if avg_per_day >= 1.0:
            prediction = "high"
        elif avg_per_day >= 0.5:
            prediction = "medium"
        else:
            prediction = "low"

    # recommendation rules (can be enhanced via model)
    rec = "Keep it up — maintain that momentum." if prediction == "high" else \
          "Good progress — try small consistency boosts." if prediction == "medium" else \
          "Start tiny: 1 habit, 5 minutes daily to build momentum."

    return jsonify({
        "features": {"total": total, "unique_habits": unique, "streak": streak, "avg_per_day": avg_per_day},
        "mood": prediction,
        "probability": prob,
        "recommendation": rec
    })

@analytics_bp.route('/activity', methods=['GET'])
@jwt_required()
def activity():
    """
    Returns daily completion counts for the last N days (default 7)
    Response format:
    { "days": ["2025-12-11","2025-12-10",...], "counts": [2,0,1,...] }
    """
    uid = get_jwt_identity()
    days = int(request.args.get('days', 7))
    today = datetime.datetime.utcnow().date()
    start = today - datetime.timedelta(days=days-1)  # inclusive
    # fetch logs for this user in range
    docs = list(logs.find({"user_id": uid, "date": {"$gte": datetime.datetime.combine(start, datetime.time.min)}}))
    # count per date
    counts_map = {}
    for d in docs:
        date_only = d['date'].date().isoformat()
        counts_map[date_only] = counts_map.get(date_only, 0) + 1
    # build arrays (ordered oldest -> newest)
    days_list = []
    counts = []
    for i in range(days):
        dt = (start + datetime.timedelta(days=i))
        key = dt.isoformat()
        days_list.append(key)
        counts.append(counts_map.get(key, 0))
    return jsonify({"days": days_list, "counts": counts})