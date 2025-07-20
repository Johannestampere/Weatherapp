"use client"

import GoogleLoginButton from "@/components/GoogleLoginButton";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/chat");
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="text-2xl font-bold text-green-900">loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 min-h-screen w-full">
      <h1 className="text-5xl font-extrabold text-green-900 drop-shadow-lg text-center">Welcome to <span className="text-green-700">WeatherGPT</span>,<br/> sign in to get started</h1>
      <div>
        <GoogleLoginButton/>
      </div>
    </div>
  )
}