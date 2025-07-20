"use client"
import { useRouter } from "next/router"


export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include"
        })

        router.push("/")
    }

    return <button onClick={handleLogout}>Log Out</button>;
}