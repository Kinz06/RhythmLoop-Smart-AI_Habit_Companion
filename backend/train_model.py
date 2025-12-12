# backend/train_model.py
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from models import logs, users, habits
import datetime
from collections import defaultdict
import os

def get_feature_rows(days_window=14):
    """
    Build toy dataset:
    - For each user, compute features for the last `days_window` days.
    - Label: mood/productivity class based on average completions per day:
        0 = low (<0.5), 1 = medium (0.5-0.99), 2 = high (>=1.0)
    """
    rows = []
    now = datetime.datetime.utcnow()
    users_cursor = users.find()
    for u in users_cursor:
        uid = str(u['_id'])
        # consider logs for the window
        start = now - datetime.timedelta(days=days_window)
        docs = list(logs.find({"user_id": uid, "date": {"$gte": start}}))
        total = len(docs)
        unique_habits = len(set(d['habit_id'] for d in docs))
        # compute current streak (consecutive days at end)
        dates_set = set(d['date'].date() for d in docs)
        streak = 0
        d = now.date()
        while d in dates_set:
            streak += 1
            d = d - datetime.timedelta(days=1)
        avg_per_day = total / max(1, days_window)
        # label heuristically: useful for training demo
        if avg_per_day >= 1.0:
            label = 2
        elif avg_per_day >= 0.5:
            label = 1
        else:
            label = 0
        rows.append({
            "user_id": uid,
            "total": total,
            "unique_habits": unique_habits,
            "streak": streak,
            "avg_per_day": avg_per_day,
            "label": label
        })
    return pd.DataFrame(rows)

def train_and_save(out_path='model.pkl'):
    df = get_feature_rows(days_window=14)
    if df.shape[0] < 3:
        print("Not enough users / data to train a meaningful model. Creating toy fallback model.")
        # Create toy data
        df = pd.DataFrame([
            {'total': 30, 'unique_habits': 5, 'streak':7, 'avg_per_day':30/14, 'label':2},
            {'total': 8, 'unique_habits': 3, 'streak':2, 'avg_per_day':8/14, 'label':1},
            {'total': 1, 'unique_habits': 1, 'streak':0, 'avg_per_day':1/14, 'label':0},
        ])
    X = df[['total','unique_habits','streak','avg_per_day']].values
    y = df['label'].values
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X,y)
    joblib.dump(clf, out_path)
    print(f"Trained model saved to {out_path}")

if __name__ == "__main__":
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    train_and_save(os.path.join(os.path.dirname(__file__), 'model.pkl'))
