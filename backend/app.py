from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'devkey')
jwt = JWTManager(app)
CORS(app)

from routes.users import users_bp
from routes.habits import habits_bp
from routes.analytics import analytics_bp

app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(habits_bp, url_prefix='/api/habits')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

@app.route('/')
def home():
    return jsonify({"message":"RhythmLoop API running"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
