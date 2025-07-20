import { useEffect, useState } from "react";

export type User = {
    name: string
    email: string
};

// hook to store user state when logged in
export default function useUser() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // get user data
                const res = await fetch("http://localhost:5000/auth/me", {
                    credentials: "include"
                });

                const data = await res.json();

                if (res.ok) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            }

        }

        fetchUser();
    }, [])
    
    return { user };
}