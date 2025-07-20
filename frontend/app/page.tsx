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
      className="z-50 flex w-full flex-col items-start gap-8 px-4 pt-32 pb-48 text-md md:w-3/4 lg:w-1/2 justify-center items-center gap-10 min-h-screen"
    >
      <h1 className="text-5xl font-extrabold text-green-900 drop-shadow-lg text-center">Welcome to <span className="text-green-700">WeatherGPT</span>,<br/> sign in to get started</h1>
      <div>
        <GoogleLoginButton/>
      </div>
    </motion.div>
  )
}