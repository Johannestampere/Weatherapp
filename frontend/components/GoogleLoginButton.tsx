"use client"
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
    const handleLoginSuccess = async (credentialResponse: any) => {
        // JWT given by google
        const idToken = credentialResponse.credential;

        if (!idToken) return;

        // send google id token to backend
        const res = await fetch("http://localhost:5000/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_token: idToken }),
        });

        // get response data from backend
        const data = await res.json();

        // save the JWT returned by the backend
        if (data.token) {
            localStorage.setItem("token", data.token);
        } else {
            console.error("login failed: ", data);
        }
    }

    return (
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.error("login error")}
        />
    );
}
