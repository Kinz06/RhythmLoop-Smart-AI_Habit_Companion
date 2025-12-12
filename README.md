RhythmLoop – Smart AI Habit Companion
An AI-powered habit tracking with streak visualization, analytics, mood prediction, and offline sync.

Overview:
RhythmLoop is a full-stack intelligent habit companion designed to help users build consistency, understand their behavior patterns, and stay motivated.
It uses machine learning, behavior analytics, and clean UI design to provide insights that support long-term habit formation.

Features:

Habit Tracking:

Create habits
Daily logging
Automatic streak calculation
Activity calendar (GitHub-style heatmap)

Analytics Dashboard:

Last 30-day habit activity chart (Chart.js)
Streak calendar visualization
Habit statistics summary
ML-based insights displayed directly in the dashboard

Machine Learning Model:

Predicts user's engagement level (high / medium / low)
Recommends personalized habit strategies

Based on:

Avg completions per day
Length of streak
Total completions
Number of unique habits

Authentication System:

JWT-based login and registration
Secure password hashing
Password reset email flow (request & reset)

Offline Sync:

Habits saved locally when offline
Sync button uploads habits/logs once backend reconnects
Prevents data loss

UI / UX:

Clean React interface
Responsive design
Smooth gradients + modern cards
Toast notifications
Fully branded as RhythmLoop

Tech Stack:

Frontend:
React + Vite
React Router
Chart.js + react-chartjs-2
Toastify
LocalStorage caching

Backend:
Flask (Python)
Flask-JWT-Extended
MongoDB (PyMongo)
Scikit-learn (RandomForest model)
CORS, Bcrypt, Email support

Database:  MongoDB (Atlas or local)
