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
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <h1 className="text-bold text-3xl">Welcome to WeatherGPT, sign in to get started</h1>
      <div>
        <GoogleLoginButton/>
      </div>
    </div>
  )
}