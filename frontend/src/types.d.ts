import { Prisma } from "@prisma/client";

export type Course = Prisma.CourseGetPayload<{
    include: { instructor: true, units: { include: { assignments: true } } };
}> & { duration: number, units: Unit[] };

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: number };


