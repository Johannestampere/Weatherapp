# WeatherGPT

A chat-based web application that allows users to ask for weather data in their location.

---

## Tech Stack

- **Frontend:** React (Next.js) with Tailwind CSS
- **Backend:** Flask
- **AI:** OpenAI API (GPT-3.5 Turbo)
- **Weather Data:** WeatherAPI
- **Geolocation:** ipapi.co
- **Authentication:** Google OAuth
- **Hosting:**
  - Frontend: Vercel
  - Backend: Railway

---

## Features

- **Google OAuth:** Secure sign-in with Google accounts
- **Chat Interface:** Clean, ChatGPT-style UI for weather questions
- **Conversational AI:** Uses OpenAI for natural, friendly responses
- **Weather Data:** Fetches real-time weather based on user IP
- **Location Detection:** Uses IP for personalized weather

---

## Project Structure

```
Project_Lexiden/
  backend/
    app/
      auth.py         # Auth routes (Google OAuth, session)
      main.py         # Main Flask app, chat, weather, OpenAI integration
    requirements.txt  # Python dependencies
    Procfile          # For Railway deployment
  frontend/
    app/              # Next.js app directory
    components/       # React components (GoogleLoginButton, LogOutButton)
    lib/              # Custom React hooks (useUser)
    public/           # Static assets
    package.json      # Frontend dependencies
    tailwind.config.js# Tailwind CSS config
  README.md           # This file
```
