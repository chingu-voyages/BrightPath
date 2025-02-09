"use client";
import { type Assignment } from "@/types";

export const ReadingAssignmentModal = ({
    assignment,
}: {
    assignment: Assignment;
}) => {
    return (
        <>
            <article
                dangerouslySetInnerHTML={{
                    __html: assignment.ReadingAssignment?.content || "",
                }}
            ></article>
        </>
    );
};
