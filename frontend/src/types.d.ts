import { Prisma } from "@prisma/client";

export type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: { include: { assignments: true } } };
}> & { duration: number; units: Unit[] };

export type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: number; assignments: Assignment[] };

export type Enrollment = Prisma.EnrollmentGetPayload<{
    include: { course: true; user: true; certificate: true };
}> & { course: Course; granularProgress: GranularProgress };

export type Assignment = Prisma.AssignmentGetPayload<{
    include: {
        ReadingAssignment: true;
        VideoAssignment: true;
        InteractiveAssignment: true;
        QuizAssignment: true;
    };
}>;

export type Certificate = Prisma.CertificateGetPayload<{
    include: { user: true; enrollment: { include: { course: true } } };
}>;

export interface GranularProgress extends Prisma.JsonValue {
    [unitId: string]: {
        [assignmentId: string]: number; // Each assignment has a progress value
    };
}
