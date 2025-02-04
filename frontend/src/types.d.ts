import { Prisma } from '@prisma/client';

export type Course = Prisma.CourseGetPayload<{
    include: { instructor: true };
}> & { duration: number };
