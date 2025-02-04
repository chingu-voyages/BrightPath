"use client";

import { type Prisma, type Enrollment } from "@prisma/client";
import { useState } from "react";

export const CompleteAssignmentButton = ({
    assignmentId,
    enrollment,
    unitId,
}: {
    assignmentId: number;
    enrollment: Enrollment;
    unitId: number;
}) => {
    const granularProgress = enrollment.granularProgress as Prisma.JsonObject;

    // @ts-ignore
    const granularStatus = granularProgress[unitId][assignmentId] as boolean;

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<boolean>(granularStatus);

    const handle = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments/${enrollment.id}/complete-assignment`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        assignmentId,
                        unitId,
                        status: !status,
                    }),
                },
            );

            const data = await response.json();
            if (response.ok) {
                setStatus(!status);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Loading..." : status ? "Complete" : "Incomplete"}
            </button>
        </div>
    );
};
