"use client"
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleLoginSuccess = async (credentialResponse: any) => {
        // JWT given by google
        const idToken = credentialResponse.credential;

        if (!idToken) return;

        // send google id token to backend
        const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_token: idToken }),
            credentials: "include"
        });

        // get response data from backend
        const data = await res.json();

        // check whether login was successful
        if (res.ok && data.message === "JWT valid, login valid") {
            console.log("Login successful:", data);
            router.push("/chat");
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
