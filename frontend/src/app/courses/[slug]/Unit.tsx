"use client";
import moment from "moment";
import AssignmentComponent from "./Assignment";
import { Assignment, Unit } from "@/types";
import { useContext, useState } from "react";
import { CoursePageContext } from "./Course";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export const UnitComponent = ({ unit, n }: { unit: Unit; n: number }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Track which modal is open
    const [isCollapsed, setIsCollapsed] = useState<boolean>(n !== 0);
    const { enrolled, setEnrolled } = useContext(CoursePageContext);

    const handleContinue = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex !== null && prevIndex < unit.assignments.length - 1
                ? prevIndex + 1
                : null,
        );
    };

    return (
        <div className={`${n !== 0 ? "pt-4 border-t border-gray-200" : ""}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold">
                        Unit {n + 1}
                        <span className="mx-1 text-brightpath-blue">•</span>
                        {moment.duration(unit.duration).humanize()}
                    </h4>
                    <h3 className="font-brand font-bold text-2xl mb-2">
                        {unit.title}
                    </h3>
                </div>
                <div className="cursor-pointer px-4">
                    {isCollapsed ? (
                        <KeyboardArrowDown
                            fontSize="large"
                            onClick={() => setIsCollapsed(false)}
                        />
                    ) : (
                        <KeyboardArrowUp
                            fontSize="large"
                            onClick={() => setIsCollapsed(true)}
                        />
                    )}
                </div>
            </div>
            {!isCollapsed && (
                <div>
                    <p className="mb-2">{unit.description}</p>
                    {unit.assignments?.map(
                        (assignment: Assignment, index: number) => (
                            <AssignmentComponent
                                key={assignment.id}
                                assignment={assignment}
                                unitId={unit.id}
                                isOpen={currentIndex === index}
                                onOpen={() => setCurrentIndex(index)}
                                onContinue={handleContinue}
                                onClose={() => setCurrentIndex(null)}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};
