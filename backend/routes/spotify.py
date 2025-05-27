import os
import requests
import time
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from base64 import b64encode
from flask_cors import CORS

load_dotenv()

spotify_bp = Blueprint("spotify", __name__)
CORS(spotify_bp)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# Global token cache
spotify_token_data = {
    "access_token": None,
    "expires_at": 0  # Unix timestamp
}

def get_spotify_access_token():
    global spotify_token_data
    current_time = time.time()
    # Reuse token if still valid
    if spotify_token_data["access_token"] and spotify_token_data["expires_at"] > current_time:
        return spotify_token_data["access_token"]

    # Request new token
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

    token_data = res.json()
    spotify_token_data["access_token"] = token_data["access_token"]
    spotify_token_data["expires_at"] = current_time + token_data["expires_in"] - 60  # buffer
    return spotify_token_data["access_token"]


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


@spotify_bp.route("/album-tracks", methods=["GET", "OPTIONS"])
def get_spotify_album_tracks():
    album_id = request.args.get("AlbumId")
    if not album_id:
        return jsonify({"error": "Missing AlbumId parameter"}), 400

    token = get_spotify_access_token()
    if not token:
        return jsonify({"error": "Failed to get token"}), 500

    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.spotify.com/v1/albums/{album_id}/tracks?offset=0&limit=20&locale=en-US,en;q%3D0.5"
    res = requests.get(url, headers=headers)

    return jsonify(res.json()), res.status_code

@spotify_bp.route('/artist-data')
def get_artist_data():
    artist_id = request.args.get("artistId")
    print(artist_id,flush=True)
    token = get_spotify_access_token()
    if not token:
        return jsonify({"error": "Failed to get token"}), 500
    
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.spotify.com/v1/artists/{artist_id}"
    res = requests.get(url, headers=headers)
    print(res,flush=True)
    return jsonify(res.json()), res.status_code