"use client"
import { useRouter } from "next/navigation"


export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("http://localhost:5001/auth/logout", {
            method: "POST",
            credentials: "include"
        })

        router.push("/")
    }

    return <button onClick={handleLogout}>Log Out</button>;
}