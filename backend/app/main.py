from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from flask import session
from flask_session import Session
from auth import auth_blueprint
from openai import OpenAI

# load env variables from .env
load_dotenv()

# create the flask app
app = Flask(__name__)

# default to localhost for dev
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
CORS(app, supports_credentials=True, origins=origins, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

# session handling config
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.secret_key = os.getenv("FLASK_SECRET_KEY")

Session(app)

weather_api_key = os.getenv("WEATHER_API_KEY")

app.register_blueprint(auth_blueprint, url_prefix="/auth")

@app.route("/chat", methods=["POST"])
def chat():
    # check if user is authenticated
    user = session.get("user")
    if not user:
        return jsonify({"error": "not authenticated"}), 401
    
    try:
        # extract data from message sent from the frontend
        data = request.get_json()
        message = data.get("message")
        location = data.get("location")

        if not message:
            return jsonify({"error": "no message provided"}), 400
        
        # get user's IP address
        ip = request.headers.get("X-forwarded-for", request.remote_addr)

        # use IPAPI to get the user's city
        ipapi_response = requests.get(f"https://ipapi.co/{ip}/json/")
        ipapi_data = ipapi_response.json()
        city = ipapi_data.get("city")

        if not city:
            city = "Waterloo"  # only for dev

        # use WeatherAPI to get current weather in that city
        weather_response = requests.get(f"http://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={city}").json()

        if not weather_response:
            return ({"error": "error with getting weather data"}), 400

        # extract important fields from the weather API's response
        city = weather_response["location"]["name"]
        region = weather_response["location"]["region"]
        country = weather_response["location"]["country"]
        condition = weather_response["current"]["condition"]["text"]
        temperature = weather_response["current"]["temp_c"]
        feelslike = weather_response["current"]["feelslike_c"]
        wind_speed = weather_response["current"]["wind_kph"]
        uv = weather_response["current"]["uv"]

        # summary that goes to openAI
        weather_summary = f"{condition}, {temperature}°C in {city}, {region}, {country}. Other factors: feels like {feelslike}, wind speed: {wind_speed}, uv: {uv}"

        # make the perfect prompt
        prompt = f"""
You are a friendly weather assistant.
The current weather is {weather_summary}.
The user asked: "{message}".
Respond in a very natural, conversational tone.
You may use simple markdown for emphasis (like *italics* or **bold**), but avoid using headings or excessive formatting.
Be friendly and warm.

Example response:
It's currently **overcast** and *21.1°C* in Waterloo. A bit cloudy, but still comfortable! The wind is gentle at 5 km/h, and the UV index is low. Enjoy your day!
"""

        # call openAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        chat_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )

        reply = chat_response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# to run locally or on Railway
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, host="0.0.0.0", port=port)
