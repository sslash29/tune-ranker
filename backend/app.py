from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.spotify import spotify_bp
from dotenv import load_dotenv
import os

load_dotenv()

# Create app
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.register_blueprint(spotify_bp, url_prefix="/api")
CORS(app)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path and os.path.exists(f"{app.static_folder}/{path}"):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html") 

if __name__ == "__main__":
    # The SSL code below is commented out to ensure the app starts
    # We'll re-enable it after fixing certificate issues
    cert_directory = '/app/certificates'
    cert_path = os.path.join(cert_directory, 'cert.crt')
    key_path = os.path.join(cert_directory, 'cert.key')
    
    print(f"Looking for certificates in: {cert_directory}")
    
    if os.path.exists(cert_directory):
        print(f"Contents of {cert_directory}: {os.listdir(cert_directory)}")
    else:
        print(f"Certificate directory {cert_directory} does not exist!")
        os.makedirs(cert_directory, exist_ok=True)
        print(f"Created directory {cert_directory}")
    
    if os.path.exists(cert_path) and os.path.exists(key_path):
        print("Found SSL certificates! Starting with HTTPS...")
        app.run(debug=True, host="0.0.0.0", port=5000, ssl_context=(cert_path, key_path))
    else:
        print("SSL certificates not found. Starting without HTTPS...")
        app.run(debug=True, host="0.0.0.0", port=5000)