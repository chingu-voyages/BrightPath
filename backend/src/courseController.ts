import { Context } from "./context";

export async function getAllCourses(ctx: Context) {
    return await ctx.prisma.course.findMany({ include: { instructor: true } });
}

export async function getCourseBySlug(ctx: Context, slug: string) {
    return await ctx.prisma.course.findUnique({
        where: { slug },
        include: {
            instructor: true,
            units: { include: { assignments: true } },
        },
    });
}
