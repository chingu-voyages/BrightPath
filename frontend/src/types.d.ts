import { Prisma } from "@prisma/client";

export type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: { include: { assignments: true } } };
}> & { duration: number; units: Unit[] };

export type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: number };

export type Enrollment = Prisma.EnrollmentGetPayload<{
    include: { course: true; user: true };
}> & { course: Course };
