"use client";
import { useState } from "react";
import { Modal } from "antd";
import moment from "moment";
import { AssignmentType, Enrollment, type Assignment } from "@prisma/client";
import { CompleteAssignmentButton } from "./CompleteAssignmentButton";
import { AdsClick, Book, ChecklistRtl, Monitor } from "@mui/icons-material";

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
                footer={null}
                width="100vw"
                style={{
                    top: 0,
                    height: "100vh",
                    maxWidth: "100vw",
                    padding: 0,
                }}
                styles={{ body: { height: "100vh", overflow: "hidden" } }}
                className="custom-fullscreen-modal"
            >
                <div className="h-full flex flex-col p-6 bg-white">
                    <h2 className="text-xl font-semibold">
                        {assignment.title}
                    </h2>

                    {/* Complete Assignment Button */}
                    {enrollment && (
                        <div className="mt-auto">
                            <CompleteAssignmentButton
                                assignmentId={assignment.id}
                                unitId={unitId}
                                enrollment={enrollment}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
