"use client";
import { type Prisma } from "@prisma/client";

type Assignment = Prisma.AssignmentGetPayload<{
    include: { ReadingAssignment: true };
}>;

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
