"use client";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import { Modal, Breadcrumb } from "antd";
import { Prisma, AssignmentType } from "@prisma/client";
import { CompleteAssignmentButton } from "./CompleteAssignmentButton";
import { Lock } from "@mui/icons-material";
import { ReadingAssignmentModal } from "./ReadingAssignment";

import { type Assignment } from "@/types";
import { CoursePageContext } from "./Course";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AssignmentIcon } from "./AssignmentIcon";
import QuizAssigmentModal from "./QuizAssigmentModal";
import VideoAssigmentModal from "./VideoAssigmentModal";
import Link from "next/link";
import Image from "next/image";

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
    const currentUnit = course?.units.find((unit) => unit.id === unitId);

    const { data: session, update } = useSession();

    const handleEnroll = async () => {
        setLoading(true);

        const courseURL = encodeURI(
            window.location.protocol +
                "//" +
                window.location.host +
                `/courses/${course?.id}`,
        );

        if (!session || !session.user) {
            redirect("/signin?callbackUrl=" + courseURL);
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
                className="flex items-center mb-4 border-4 rounded-lg p-4 cursor-pointer border-brightpath-slate"
                onClick={handleEnroll}
            >
                <div className="">
                    <AssignmentIcon type={assignment.type} />
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

    const isCompleted = unitProgress?.[`${assignment.id}`] === true;

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
        Object.entries(nextUnit[1]).find(([id, progress]) => progress === 0);

    const isNextAssignment =
        nextAssignment && Number(nextAssignment[0]) === assignment.id;

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
            title: (
                <Link href="/">
                    <Image
                        src="/Logo_LightM.png"
                        alt="Logo"
                        width={142}
                        height={31}
                    />
                </Link>
            ),
        },
        {
            title: <Link href={`/courses/${course?.id}`}>{course?.title}</Link>,
        },
        {
            title: currentUnit?.title,
        },
        {
            title: assignment.title,
        },
    ];

    const footer = (
        <div className="flex items-center justify-between">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-brightpath-blue hover:underline"
            >
                Back to course overview
            </button>

            <button onClick={completeAssignment} className="button">
                Continue
            </button>
        </div>
    );

    return (
        <>
            <div
                className={`flex items-center mb-4 border-4  rounded-lg p-4 cursor-pointer ${isCompleted ? "bg-brightpath-gold/[.10] border-brightpath-gold" : isNextAssignment ? "border-brightpath-blue" : "border-brightpath-slate"}`}
            >
                <div className="font-semibold">
                    <AssignmentIcon type={assignment.type} />
                </div>
                <div className="flex-1 ml-4">
                    <div className="flex items-center text-sm font-semibold">
                        <p>{types[assignment.type]}</p>
                        <span className="mx-2 text-brightpath-blue">•</span>
                        <p>{moment.duration(assignment.duration).humanize()}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h4
                            onClick={
                                isAssignmentUnlocked(assignment)
                                    ? onOpen
                                    : undefined
                            }
                            className="text-lg font-semibold cursor-pointer hover:underline"
                        >
                            {assignment.title}
                        </h4>
                    </div>
                </div>
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

            {/* Full-Screen Modal */}
            <Modal
                open={isOpen}
                onCancel={onClose}
                footer={footer}
                getContainer={false}
            >
                <div className="container flex flex-col h-full overflow-y-auto mx-auto lg:max-w-6xl p-6 bg-white">
                    <header className="flex items-center justify-between mb-6">
                        <Breadcrumb separator=">" items={breadcrumb} />
                    </header>
                    <div>
                        {assignment.type === AssignmentType.READING && (
                            <ReadingAssignmentModal assignment={assignment} />
                        )}

                        {assignment.type === AssignmentType.VIDEO && (
                            <VideoAssigmentModal
                                complete={completeAssignment}
                                assignment={assignment}
                            />
                        )}

                        {assignment.type === AssignmentType.INTERACTIVE && (
                            <ReadingAssignmentModal assignment={assignment} />
                        )}

                        {assignment.type === AssignmentType.QUIZ && (
                            <QuizAssigmentModal
                                complete={completeAssignment}
                                assignment={assignment}
                            />
                        )}

                        {assignment.type ===
                            AssignmentType.TIMED_ASSESSMENT && (
                            <QuizAssigmentModal
                                complete={completeAssignment}
                                timed={false}
                                assignment={assignment}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
