"use client";

import { useContext, useState } from "react";
import { CoursePageContext } from "./Course";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { KeyboardArrowRight } from "@mui/icons-material";
import { AssignmentType } from "@prisma/client";
import { AssignmentIcon } from "./AssignmentIcon";

export default function EnrollButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("Start learning!");
    const { data: session } = useSession();
    const { course, enrolled, setEnrolled } = useContext(CoursePageContext);

    if (!session?.user) {
        return <Link href="/auth/signin">Enroll</Link>;
    }

    const handleEnroll = async () => {
        setLoading(true);
        setMessage("Enrolling...");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        courseId: course?.id,
                        userId: session?.user?.id,
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                setEnrolled(data);
            }
        } catch (err) {
            setMessage("Failed to enroll");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (enrolled) {
        // todo: refactor finding next assignment
        const granularProgress = enrolled.granularProgress as Record<
            string,
            Record<string, number>
        >;
        const nextUnit = Object.entries(granularProgress).find(
            ([unit, assignments]) => {
                return Object.entries(assignments).find(
                    ([id, progress]) => progress === 0,
                );
            },
        );

        const nextAssignment =
            nextUnit &&
            Object.entries(nextUnit[1]).find(
                ([id, progress]) => progress === 0,
            );

        if (nextAssignment === undefined) {
            return (
                <button
                    disabled
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Continue learning

                </button>
            );
        }

        const actualNextAssignment =
            nextUnit &&
            nextAssignment &&
            course?.units
                .find((unit) => unit.id === parseInt(nextUnit[0]))
                ?.assignments.find(
                    (assignment) =>
                        assignment.id === parseInt(nextAssignment[0]),
                );

        return (
            <button className="text-left px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-nowrap">Continue learning</p>

                        <div className="flex items-center">
                            <AssignmentIcon type={actualNextAssignment?.type || 'READING'} />
                            <p className="pl-2 text-lg font-bold">{actualNextAssignment?.title}</p>
                        </div>
                    </div>
                    <KeyboardArrowRight fontSize="large" />
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={handleEnroll}
            disabled={loading || message === "Enrolled"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
            {message}
        </button>
    );
}
