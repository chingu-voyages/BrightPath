import { Context } from "./context";

export async function getAllCourses(ctx: Context) {
    return await ctx.prisma.course.findMany();
}
