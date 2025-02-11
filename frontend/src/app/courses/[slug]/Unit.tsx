"use client";
import moment from "moment";
import AssignmentComponent from "./Assignment";
import { Assignment, Unit } from "@/types";
import { useContext, useState } from "react";
import { CoursePageContext } from "./Course";

export const UnitComponent = ({ unit, n }: { unit: Unit; n: number }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Track which modal is open
    const { enrolled, setEnrolled } = useContext(CoursePageContext);

    const handleContinue = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex !== null && prevIndex < unit.assignments.length - 1
                ? prevIndex + 1
                : null,
        );
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                    Unit {n + 1} - {moment.duration(unit.duration).humanize()}
                </h4>
            </div>
            <h3 className="text-lg font-semibold mb-2">{unit.title}</h3>
            <p className="">{unit.description}</p>
            {unit.assignments?.map((assignment: Assignment, index: number) => (
                <AssignmentComponent
                    key={assignment.id}
                    assignment={assignment}
                    unitId={unit.id}
                    isOpen={currentIndex === index}
                    onOpen={() => setCurrentIndex(index)}
                    onContinue={handleContinue}
                    onClose={() => setCurrentIndex(null)}
                />
            ))}
        </div>
    );
};
