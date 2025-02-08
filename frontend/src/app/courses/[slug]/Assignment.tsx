"use client";
import { useEffect, useState } from "react";
import { Modal, Breadcrumb } from "antd";
import moment from "moment";
import { AssignmentType, Enrollment, type Assignment } from "@prisma/client";
import { CompleteAssignmentButton } from "./CompleteAssignmentButton";
import { AdsClick, Book, ChecklistRtl, Monitor } from "@mui/icons-material";
import { ReadingAssignmentModal } from "./ReadingAssignment";

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
    enrollment,
    unitId,
}: {
    assignment: Assignment;
    enrollment: Enrollment | undefined;
    unitId: number;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden"; // Hide parent scrollbar
        } else {
            document.body.style.overflow = ""; // Restore scrolling when closed
        }
    }, [isModalOpen]);

    const footer =(<div>Footer</div>);

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
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer hover:underline"
                        >
                            {assignment.title}
                        </h4>

                        {enrollment && (
                            <CompleteAssignmentButton
                                assignmentId={assignment.id}
                                unitId={unitId}
                                enrollment={enrollment}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Full-Screen Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={footer}
                width="100%"
                style={{
                    top: 0,
                    margin: 0,
                    padding: 0,
                    borderRadius: 0,
                    height: "100%",
                    width: "100%",
                    maxWidth: "100%",
                }}
                styles={{ content: { height: "auto", minHeight: "100%", borderRadius: 0, overflow: "hidden" } }}
                getContainer={false}
            >
                <div className="container mx-auto h-full p-6 bg-white">
                    <header className="flex items-center justify-between mb-6">
                        <Breadcrumb separator=">"/>
                    </header>
                    <div className="overflow-y h-[200px]">
                    {assignment.type === AssignmentType.READING && (
                        <ReadingAssignmentModal assignment={assignment} />
                    )}
                    </div>

                </div>
            </Modal>
        </>
    );
}
