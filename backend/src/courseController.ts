import { Context } from "./context";

export async function getAllCourses(ctx: Context) {
    return await ctx.prisma.course.findMany({
        include: {
            instructor: true,
            units: {
                include: {
                    assignments: {
                        orderBy: { order: "asc" },
                    },
                },
            },
            tags: {
                include: { tag: true },
            },
        },
    });
}

export async function getCourseBySlug(ctx: Context, slug: string) {
    return await ctx.prisma.course.findUnique({
        where: { slug },
        include: {
            instructor: true,
            units: {
                include: {
                    assignments: {
                        include: {
                            ReadingAssignment: true,
                            VideoAssignment: true,
                            InteractiveAssignment: true,
                            QuizAssignment: true,
                        },
                        orderBy: { order: "asc" },
                    },
                },
            },
            tags: {
                include: { tag: true },
            },
        },
    });
}
