"use client";

import moment from "moment";
import { useContext, useState } from "react";
import { CoursePageContext } from "./Course";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Check, KeyboardArrowRight } from "@mui/icons-material";
import { EnrollmentStatus } from "@prisma/client";
import { AssignmentIcon } from "./AssignmentIcon";
function truncateString(str: string, lim: number) {
    return str.length > lim
        ? str.slice(0, lim > 3 ? lim - 3 : lim) + "..."
        : str;
}
export default function EnrollButton({ compact }: { compact?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("Start learning!");
    const { data: session } = useSession();
    const { course, enrolled, setEnrolled } = useContext(CoursePageContext);

    if (!session?.user) {
        // whole url
        const redirectURL = encodeURIComponent(
            window.location.protocol +
                "//" +
                window.location.host +
                "/courses/" +
                course?.slug,
        );
        return (
            <Link
                href={`/signin?callbackUrl=${redirectURL}`}
                className="button"
            >
                Start learning!
            </Link>
        );
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
        if (enrolled.status === EnrollmentStatus.COMPLETED) {
            return (
                <div>
                    <div className="text-xl font-bold text-right">
                        <span className="pr-2">Course complete!</span>
                        <Check fontSize="large" className="text-green-500" />
                    </div>
                    You finished the course on{" "}
                    {moment(enrolled.certificate?.issuedAt).format("LL")}
                </div>
            );
        }
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
                    className="button text-white rounded hover:bg-blue-600"
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
            <button className="text-left button">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-nowrap">Continue learning</p>

                        <div className="flex items-center">
                            <AssignmentIcon
                                type={actualNextAssignment?.type || "READING"}
                            />
                            <p
                                className={`pl-2 font-bold ${compact ? "text-sm ellipsis" : "text-lg"}`}
                            >
                                {compact
                                    ? truncateString(
                                          actualNextAssignment?.title || "",
                                          16,
                                      )
                                    : actualNextAssignment?.title}
                            </p>
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
            className="button"
        >
            {message}
        </button>
    );
}
