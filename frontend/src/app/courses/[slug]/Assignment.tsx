"use client";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import { Modal, Breadcrumb } from "antd";
import { Prisma, AssignmentType } from "@prisma/client";
import { CompleteAssignmentButton } from "./CompleteAssignmentButton";
import {
    AdsClick,
    Book,
    ChecklistRtl,
    Lock,
    Monitor,
} from "@mui/icons-material";
import { ReadingAssignmentModal } from "./ReadingAssignment";

import { type Assignment } from "@/types";
import { CoursePageContext } from "./Course";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import QuizAssigmentModal from "./QuizAssigmentModal";
import InteractiveAssigment from "./InteractiveAssigment";
import VideoAssigmentModal from "./VideoAssigmentModal";

// format assignmetn types names to be displayed
const types = {
    READING: "Reading",
    VIDEO: "Video",
    INTERACTIVE: "Interactive",
    QUIZ: "Quiz",
    TIMED_ASSESSMENT: "Timed Assessment",
};

export default function AssignmentComponent({
    assignment,
    unitId,
    isOpen,
    onOpen,
    onContinue,
    onClose,
}: {
    assignment: Assignment;
    unitId: number;
    isOpen: boolean;
    onOpen: () => void;
    onContinue: () => void;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const { course, enrolled, setEnrolled } = useContext(CoursePageContext);

    const { data: session, update } = useSession();

    const handleEnroll = async () => {
        setLoading(true);

        if (!session || !session.user) {
            redirect("/auth/signin");
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        courseId: course?.id,
                        userId: session.user.id,
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

    useEffect(() => {
        if (enrolled && isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }

        return () => document.body.classList.remove("modal-open");
    }, [isOpen]);

    if (!enrolled) {
        return (
            <div
                className="flex items-center mb-4 border-2 rounded-lg py-3 px-4 cursor-pointer"
                onClick={handleEnroll}
            >
                <div className="">
                    {assignment.type === AssignmentType.READING && <Book />}
                    {assignment.type === AssignmentType.VIDEO && <Monitor />}
                    {assignment.type === AssignmentType.INTERACTIVE && (
                        <AdsClick />
                    )}
                    {(assignment.type === AssignmentType.QUIZ ||
                        assignment.type ===
                            AssignmentType.TIMED_ASSESSMENT) && (
                        <ChecklistRtl />
                    )}
                </div>
                <div className="flex-1 ml-4">
                    <div className="flex items-center">
                        <p>{types[assignment.type]}</p>
                        <span className="mx-2">•</span>
                        <p>{moment.duration(assignment.duration).humanize()}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h4 className="cursor-pointer hover:underline">
                            {assignment.title}
                        </h4>
                    </div>
                </div>
            </div>
        );
    }

    // @ts-ignore
    const unitProgress = enrolled?.granularProgress?.[
        `${unitId}`
    ] as Prisma.JsonObject;

    const isAssignmentUnlocked = (assignment: Assignment) => {
        if (assignment.type !== AssignmentType.QUIZ) return true;
        return Object.entries(unitProgress)
            .filter(([id]) => Number(id) !== assignment.id) // Exclude the quiz itself
            .every(([, completed]) => completed === true); // Check if all others are true
    };

    const completeAssignment = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/enrollments/${enrolled?.id}/complete-assignment`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        assignmentId: assignment.id,
                        unitId,
                        status: true,
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
            onContinue();
        }
    };

    const breadcrumb = [
        {
            title: "Course Overview",
        },
        {
            title: "Unit 1",
        },
        {
            title: assignment.title,
        },
    ];

    const footer = (
        <div className="flex items-center justify-between">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white bg-gray-400 rounded-lg"
            >
                Back to course overview
            </button>

            <button
                onClick={completeAssignment}
                className="px-4 py-2 text-sm text-white bg-gray-400 rounded-lg"
            >
                Continue
            </button>
        </div>
    );

    return (
        <>
            {/* Assignment Preview */}
            <div
                key={assignment.id}
                className="flex items-center mb-4 border-2 rounded-lg py-3 px-4 cursor-pointer"
            >
                <div className="">
                    {assignment.type === AssignmentType.READING && <Book />}
                    {assignment.type === AssignmentType.VIDEO && <Monitor />}
                    {assignment.type === AssignmentType.INTERACTIVE && (
                        <AdsClick />
                    )}
                    {(assignment.type === AssignmentType.QUIZ ||
                        assignment.type ===
                            AssignmentType.TIMED_ASSESSMENT) && (
                        <ChecklistRtl />
                    )}
                </div>
                <div className="flex-1 ml-4">
                    <div className="flex items-center">
                        <p>{types[assignment.type]}</p>
                        <span className="mx-2">•</span>
                        <p>{moment.duration(assignment.duration).humanize()}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h4
                            onClick={onOpen}
                            className="cursor-pointer hover:underline"
                        >
                            {assignment.title}
                        </h4>

                        {isAssignmentUnlocked(assignment) && (
                            <CompleteAssignmentButton
                                assignmentId={assignment.id}
                                unitId={unitId}
                            />
                        )}
                        {!isAssignmentUnlocked(assignment) && (
                            <div className="px-3 py-2">
                                <Lock fontSize="large" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full-Screen Modal */}
            <Modal
                open={isOpen}
                onCancel={onClose}
                footer={footer}
                getContainer={false}
            >
                <div className="container mx-auto lg:max-w-6xl  p-6 bg-white overflow-y-hidden">
                    <header className="flex items-center justify-between mb-6">
                        <Breadcrumb separator=">" items={breadcrumb} />
                    </header>
                    <div className="overflow-y h-full">
                        {assignment.type === AssignmentType.READING && (
                            <ReadingAssignmentModal assignment={assignment} />
                        )}

                        {/* quiz ?? */}
                        {assignment.type === AssignmentType.QUIZ && (
                            <QuizAssigmentModal
                                complete={completeAssignment}
                                assignment={assignment}
                            />
                        )}

                        {/* timed */}
                        {assignment.type ===
                            AssignmentType.TIMED_ASSESSMENT && (
                            <QuizAssigmentModal
                                complete={completeAssignment}
                                timed={false}
                                assignment={assignment}
                            />
                        )}

                        {assignment.type === AssignmentType.INTERACTIVE && (
                            <InteractiveAssigment
                                complete={completeAssignment}
                                timed={false}
                                assignment={assignment}
                            />
                        )}

                        {assignment.type === AssignmentType.VIDEO && (
                            <VideoAssigmentModal
                                complete={completeAssignment}
                                assignment={assignment}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
