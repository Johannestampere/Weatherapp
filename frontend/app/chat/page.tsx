import LogoutButton from "@/components/LogOutButton";
import { useState, useEffect } from "react";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";


export default function MainPage() {
    // use custom hook to get user data
    const { user } = useUser();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [reply, setReply] = useState<string | null>(null)
    const [sending, setSending] = useState(false);

    // if user isn't logged in, take back to / route
    if (!user) {
        router.push("/");
        return null;
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        setSending(true);
        
        try{
            const res = await fetch("http://localhost:5000/chat", {
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
        <div>
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
            className="px-6 py-2 bg-grey-200 text-white rounded-lg hover:bg-blue-400 transition">
                {sending ? "Thinking" : "Send"}
            </button>

            {reply && (
                <div>
                    <p>{reply}</p>
                </div>
            )}
        </div>
    )
}