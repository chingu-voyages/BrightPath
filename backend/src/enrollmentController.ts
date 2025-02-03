import { Context } from "./context";
import { EnrollmentStatus } from "@prisma/client";

export async function getAllEnrollments(ctx: Context) {
    return await ctx.prisma.enrollment.findMany({
        include: { course: true, user: true },
    });
}

export async function getEnrollmentsByUserId(ctx: Context, userId: string) {
    return await ctx.prisma.enrollment.findMany({
        where: { userId },
        include: { course: true, user: true },
    });
}

export async function createEnrollment(
    ctx: Context,
    courseId: number,
    userId: string,
) {
    return await ctx.prisma.enrollment.create({
        data: {
            courseId,
            userId,
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
