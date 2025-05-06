# backend/routes/spotify.py
import os
import requests
from flask import Blueprint, jsonify
from dotenv import load_dotenv
from base64 import b64encode

load_dotenv()

spotify_bp = Blueprint("spotify", __name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

@spotify_bp.route("/spotify-token", methods=["GET","OPTIONS"] )
def get_spotify_token():
    print("reached spotify-token",flush=True)
    auth_header = b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}

    res = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    if res.status_code != 200:
        return jsonify({"error": "Failed to get token", "details": res.json()})
    
    token = res.json()["access_token"]
    return jsonify({"access_token": token}), 200
