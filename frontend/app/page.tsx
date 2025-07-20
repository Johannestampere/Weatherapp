"use client"

import GoogleLoginButton from "@/components/GoogleLoginButton";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
      className="flex flex-col items-center justify-center w-full min-h-screen gap-10 px-4 pt-32 pb-48 text-md md:w-3/4 lg:w-1/2 z-50"
    >
      <h1 className="text-5xl font-extrabold text-green-900 drop-shadow-lg text-center">Welcome to <span className="text-green-700">WeatherGPT</span>,<br/> sign in to get started</h1>
      <div>
        <GoogleLoginButton/>
      </div>
    </motion.div>
  )
}