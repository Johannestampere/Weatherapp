from flask import Flask, request, jsonify, session, Blueprint
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/login", methods=["POST"])
def google_auth():
    
    try:
        # get google id token sent from frontend
        data = request.get_json()
        google_id_token = data.get("id_token")

        if not google_id_token:
            return jsonify({"error": "missing google id token"}), 400
        
        # verify the google id token via google
        id_info = id_token.verify_oauth2_token(
            google_id_token, 
            google_requests.Request(), 
            os.getenv("GOOGLE_CLIENT_ID")
        )

        user_email = id_info.get("email")
        user_name = id_info.get("name")

        session["user"] = {
            "email": user_email,
            "name": user_name
        }

        return jsonify({
            "message": "JWT valid, login valid",
            "email": user_email,
            "name": user_name
        })
    
    except ValueError as e:
        return jsonify({"error": "invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route("/me", methods=["GET"])
def get_cur_user():
    user = session.get("user")
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "not logged in"}), 401

@auth_blueprint.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "logged out successfully"})