"use client";

import { useState } from "react";

type EnrollButtonProps = {
    userId: string;
    courseId: number;
};

export default function EnrollButton({ courseId, userId }: EnrollButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("Enroll");

    const handleEnroll = async () => {
        setLoading(true);
        setMessage("Enrolling...");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, userId }),
                },
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("Enrolled");
            } else {
                setMessage("Failed to enroll");
            }
        } catch (err) {
            setMessage("Failed to enroll");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleEnroll}
                disabled={loading || message === "Enrolled"}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {message}
            </button>
        </div>
    );
}
