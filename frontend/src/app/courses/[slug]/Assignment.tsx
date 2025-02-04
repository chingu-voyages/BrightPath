import moment from "moment";
import { Enrollment, type Assignment } from "@prisma/client";
import { CompleteAssignmentButton } from "./CompleteAssignmentButton";

export default function AssignmentComponent({
    assignment,
    enrollment,
    unitId,
}: {
    assignment: Assignment;
    enrollment: Enrollment | undefined;
    unitId: number;
}) {
    return (
        <div key={assignment.id} className="mb-4 bg-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
                <p>{assignment.type}</p>
                <p>{moment.duration(assignment.duration).humanize()}</p>
            </div>

            <div className="flex items-center justify-between">
                <h4>{assignment.title}</h4>
                {enrollment && (
                    <CompleteAssignmentButton
                        assignmentId={assignment.id}
                        unitId={unitId}
                        enrollment={enrollment}
                    />
                )}
            </div>
        </div>
    );
}
