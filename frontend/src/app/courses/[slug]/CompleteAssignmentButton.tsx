"use client";

import { type Prisma, type Enrollment } from "@prisma/client";
import { useState, useEffect, useContext } from "react";
import { CoursePageContext } from "./Course";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

export const CompleteAssignmentButton = ({
    assignmentId,
    unitId,
}: {
    assignmentId: number;
    unitId: number;
}) => {
    const { enrolled, setEnrolled } = useContext(CoursePageContext);
    const [loading, setLoading] = useState(false);
    const [fetchingEnrollment, setFetchingEnrollment] = useState(!enrolled); // Track initial fetch

    const fetchEnrollment = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments/current`,
            );
            const data = await response.json();

            if (response.ok) {
                setEnrolled(data);
            }
        } catch (err) {
            console.error("Failed to fetch enrollment", err);
        } finally {
            setFetchingEnrollment(false);
        }
    };

    if (fetchingEnrollment || !enrolled) {
        return (
            <button
                type="button"
                title="enroll"
                onClick={fetchEnrollment}
                className="px-4 py-2 text-black rounded disabled:opacity-50"
                disabled={fetchingEnrollment}
            >
                <RadioButtonUnchecked fontSize="large" />
            </button>
        );
    }

    const granularProgress = enrolled.granularProgress as Prisma.JsonObject;
    // @ts-ignore
    const status = granularProgress[unitId]?.[assignmentId] as boolean;

    const handle = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments/${enrolled.id}/complete-assignment`,
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
                setEnrolled(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handle}
            className="px-4 py-2 text-black rounded disabled:opacity-50"
            disabled={loading}
        >
            {status ? (
                <CheckCircle fontSize="large" />
            ) : (
                <RadioButtonUnchecked fontSize="large" />
            )}
        </button>
    );
};
