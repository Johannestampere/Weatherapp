"use client"

import LogoutButton from "@/components/LogOutButton";
import { useState, useEffect } from "react";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function MainPage() {
    // use custom hook to get user data
    const { user, isLoading } = useUser();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [reply, setReply] = useState<string | null>(null)
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!isLoading && user === null) {
            router.push("/");
        }
    }, [user, router, isLoading]);

    if (isLoading || !user) {
        return <div className="text-2xl font-bold text-green-900">loading...</div>;
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            const res = await fetch("http://localhost:5001/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    message
                })
            })

            // get openAI's answer in json format
            const data = await res.json();
            setReply(data.reply);
        } catch (err) {
            setReply("something went wrong");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full gap-6 relative">
            <div className="absolute top-6 right-8 z-10">
                <LogoutButton />
            </div>
            <div className="w-full max-w-xl flex flex-col items-center gap-4 bg-white/70 rounded-2xl shadow-lg p-8">
                <div className="w-full mb-2">
                  <h1 className="text-3xl font-extrabold text-green-900 text-left">Hey, {user.name}</h1>
                  <h2 className="text-xl font-bold text-green-800 mt-2 mb-4 text-left">How can I help you with today’s weather?</h2>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What should I wear today?"
                  className="w-full rounded-xl border border-blue-200 p-4 mb-4 bg-white/80 text-blue-900 focus:border-blue-400 focus:ring-0 focus:outline-none transition"
                  rows={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={sending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-200 to-green-100 text-green-900 font-bold rounded-xl shadow hover:cursor-pointer hover:from-green-300 hover:to-green-200 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {sending ? "Thinking..." : "Send"}
                </button>

                {reply && (
                    <div className="mt-4 p-4 bg-green-50/80 rounded-xl shadow-inner w-full text-green-900 text-lg">
                        <ReactMarkdown>{reply}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}