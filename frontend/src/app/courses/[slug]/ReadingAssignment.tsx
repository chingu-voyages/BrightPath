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
                className="prose-lg overflow-y-auto max-h-[80vh]"
                dangerouslySetInnerHTML={{
                    __html: assignment.ReadingAssignment?.content || "",
                }}
            ></article>
        </>
    );
};
