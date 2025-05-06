import os
import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from base64 import b64encode
from flask_cors import CORS

load_dotenv()

spotify_bp = Blueprint("spotify", __name__)
CORS(spotify_bp)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# 🔹 Helper function to return token string only
def get_spotify_access_token():
    auth_header = b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    res = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)

    if res.status_code != 200:
        print("Failed to get token:", res.text)
        return None

    return res.json().get("access_token")

@spotify_bp.route("/spotify-token", methods=["GET", "OPTIONS"])
def spotify_token_route():
    token = get_spotify_access_token()
    if not token:
        return jsonify({"error": "Failed to get token"}), 500
    return jsonify({"access_token": token}), 200

@spotify_bp.route("/search-album", methods=["GET", "OPTIONS"])
def search_album():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    token = get_spotify_access_token()
    if not token:
        return jsonify({"error": "Failed to get token"}), 500

    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.spotify.com/v1/search?query={query}&type=album&limit=3"

    res = requests.get(url, headers=headers)
    return jsonify(res.json()), res.status_code
