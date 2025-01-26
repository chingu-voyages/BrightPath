"use client";

import { useState } from "react";

type EnrollButtonProps = {
    userId: string | undefined;
    slug: string; // Course slug
};

export default function EnrollButton({ userId, slug }: EnrollButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // todo: if the user is not logged in, the button should redirect to the login page

    const handleEnroll = async () => {
        setLoading(true);
        setMessage(null);

        try {
            // todo: change course id to course slug on the backend
            const response = await fetch(`/courses/${slug}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, courseSlug: slug }),
            });

            const data = await response.json();
            if (response.ok) {
                // this should disable the button, and change its text
                setMessage(data.message || "Enrollment successful!");
            } else {
                // this should not happen, but if it does, show an error message
                setMessage(data.message || "Failed to enroll.");
            }
        } catch (err) {
            setMessage("An unexpected error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleEnroll}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Enrolling..." : "Enroll"}
            </button>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
