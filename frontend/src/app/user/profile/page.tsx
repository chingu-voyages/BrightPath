"use client";

import Link from "next/link";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useEffect, useState } from "react";

export default function Profile() {
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchSession = async () => {
            const response = await fetch("/auth/session");
            if (response.ok) {
                const session = await response.json();
                setName(session.user.name);
            } else {
                setName("");
            }
        };

        fetchSession();
    }, []);
    return (
        <div>
            {name ? (
                <h2>Welcome, {name}!</h2> // Display the username
            ) : (
                <h2>Please sign in</h2>
            )}

            <Link
                href={"/user/settings"}
                className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
            >
                <div>
                    <SettingsOutlinedIcon />
                </div>
            </Link>
        </div>
    );
}
