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
        return <div>loading...</div>;
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
            console.log("DEBUGGGG OpenAI response:", data.reply);
            setReply(data.reply);
        } catch (err) {
            setReply("something went wrong");
        } finally {
            setSending(false);
        }
    }

    return (
        <div>
            <LogoutButton />
            <h1>Hey, {user.name}</h1>
            <h2>What do you want to know about today's weather?</h2>

            <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What should I wear today?"
            className="w-full rounded-lg border border-gray-300 p-4 mb-4"
            rows={4}
            />

            <button
            onClick={sendMessage}
            disabled={sending}
            className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition">
                {sending ? "Thinking" : "Send"}
            </button>

            {reply && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg markdown-content">
                    <ReactMarkdown>{reply}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}