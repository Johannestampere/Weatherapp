"use client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleLogout = async () => {
        await fetch(`${backendUrl}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })

        router.push("/")
    }

    return (
        <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 font-bold rounded-xl shadow hover:cursor-pointer hover:from-blue-300 hover:to-blue-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
            Log Out
        </button>
    );
}