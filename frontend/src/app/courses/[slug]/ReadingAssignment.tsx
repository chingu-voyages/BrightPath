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
                className="prose-lg"
                dangerouslySetInnerHTML={{
                    __html: assignment.ReadingAssignment?.content || "",
                }}
            ></article>
        </>
    );
};
