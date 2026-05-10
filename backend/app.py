from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Test route
@app.route('/')
def home():
    return jsonify({"message": "Madar Backend is running!"})

# User Routes
@app.route('/api/auth/signup', methods=['POST'])
def register():
    data = request.json
    return jsonify({"message": "User registered", "user": data}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    return jsonify({"message": "Login successful", "token": "test-token"}), 200

# Profile Routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('userId')
    return jsonify({
        "userId": user_id,
        "name": "Test User",
        "email": "test@example.com",
        "interests": ["Software Engineering", "Data Science"]
    }), 200

@app.route('/api/profile/interests', methods=['PATCH'])
def update_interests():
    data = request.json
    return jsonify({
        "message": "Interests updated successfully",
        "interests": data.get('interests', [])
    }), 200

# Major Routes
@app.route('/api/majors', methods=['GET'])
def get_majors():
    majors = [
        {"id": "1", "name": "Software Engineering", "description": "Build software and apps"},
        {"id": "2", "name": "Data Science", "description": "Analyze data and build models"},
        {"id": "3", "name": "UX Design", "description": "Design user experiences"},
        {"id": "4", "name": "Marketing", "description": "Promote products and services"}
    ]
    return jsonify(majors), 200

@app.route('/api/majors/<id>', methods=['GET'])
def get_major(id):
    return jsonify({"id": id, "name": "Software Engineering", "careerPath": "Backend, Frontend, Mobile"}), 200

# Task Routes
@app.route('/api/task/generate', methods=['POST'])
def generate_task():
    data = request.json
    return jsonify({
        "taskId": "task_001",
        "title": "Fix the bug",
        "description": "Find and fix the error in this code",
        "difficulty": "Medium"
    }), 200

@app.route('/api/task/submit', methods=['POST'])
def submit_task():
    data = request.json
    return jsonify({"message": "Task submitted successfully"}), 200

# Result Routes
@app.route('/api/result', methods=['POST'])
def create_result():
    data = request.json
    return jsonify({"resultId": "result_001", "score": 85.0, "feedback": "Good job!"}), 201

@app.route('/api/result/<userId>', methods=['GET'])
def get_result(userId):
    return jsonify({"userId": userId, "score": 85.0, "feedback": "Good job!"}), 200

if __name__ == '__main__':
    app.run(debug=True)