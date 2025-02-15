import { Context } from "./context";
import { EnrollmentStatus, Prisma } from "@prisma/client";

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}>;

export async function getAllEnrollments(ctx: Context) {
    return await ctx.prisma.enrollment.findMany({
        include: { course: true, user: true },
    });
}

export async function getEnrollmentsByUserId(ctx: Context, userId: string) {
    return await ctx.prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    instructor: true,
                    units: { include: { assignments: true } },
                },
            },
            certificate: {
                include: { user: true },
            },
        },
    });
}

export async function createEnrollment(
    ctx: Context,
    courseId: number,
    userId: string,
) {
    let granularProgress: Record<string, Record<string, number>> = {};
    try {
        const course = await ctx.prisma.course.findUniqueOrThrow({
            where: { id: courseId },
            include: { units: { include: { assignments: true } } },
        });

        granularProgress = createGranularProgressObject(course.units);
    } catch (error) {
        throw new Error("Course not found");
    }

    return await ctx.prisma.enrollment.create({
        data: {
            courseId,
            userId,
            granularProgress: granularProgress,
        },
        include: { course: true, user: true },
    });
}

export async function updateEnrollment(
    ctx: Context,
    id: number,
    status: EnrollmentStatus,
) {
    return await ctx.prisma.enrollment.update({
        where: { id: id },
        data: { status },
    });
}

export async function deleteEnrollment(ctx: Context, id: number) {
    return await ctx.prisma.enrollment.delete({
        where: { id: id },
        select: { id: true },
    });
}

export function createGranularProgressObject(units: Unit[]) {
    let granularProgress: Record<string, Record<string, number>> = {};

    for (const unit of units) {
        granularProgress[unit.id] = {};

        for (const assignment of unit.assignments) {
            granularProgress[unit.id][assignment.id] = 0;
        }
    }

    return granularProgress;
}
