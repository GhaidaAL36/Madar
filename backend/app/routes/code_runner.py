import os
import requests
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import re

code_runner_bp = Blueprint("code_runner", __name__)

ONECOMPILER_URL = "https://api.onecompiler.com/v1/run"
ONECOMPILER_KEY = os.getenv("ONECOMPILER_KEY")


@code_runner_bp.route("/run-code", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://madar-pi.vercel.app", re.compile(r"https://madar-.*\.vercel\.app")], supports_credentials=True)
def run_code():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Invalid JSON"}), 400

    language = body.get("language")
    code = body.get("code", "")
    stdin = body.get("stdin", "")

    if not language:
        return jsonify({"error": "language is required"}), 400

    default_file = "solution.py" if language == "python" else "solution.js"

    try:
        res = requests.post(
            ONECOMPILER_URL,
            headers={
                "Content-Type": "application/json",
                "X-API-Key": ONECOMPILER_KEY,
            },
            json={
                "language": language,
                "stdin": stdin,
                "files": [{"name": default_file, "content": code}],
            },
            timeout=15,
        )
    except requests.exceptions.Timeout:
        return jsonify({"error": "Code execution timed out"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 502

    if not res.ok:
        return jsonify({"error": "Code execution failed"}), res.status_code

    return jsonify(res.json()), 200