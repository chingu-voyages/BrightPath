import { Context } from "./context";
import { Course, Role } from "@prisma/client";
import { userFactory, userCreateInputFactory } from "../factories/user";
import { courseFactory, courseCreateInputFactory, unitCreateInputFactory } from "../factories/course";

export const cleanDatabase = async (ctx: Context) => {
    const deleteUnits = ctx.prisma.unit.deleteMany();
    const deleteCourses = ctx.prisma.course.deleteMany();
    const deleteUsers = ctx.prisma.user.deleteMany();

    await ctx.prisma.$transaction([deleteUnits, deleteCourses, deleteUsers]);
}

export const createPersistentCourse = async (ctx: Context, amount: number) => {
    const instructor = await ctx.prisma.user.create({
        data: userCreateInputFactory(Role.INSTRUCTOR),
    });

    const courses: Course[] = [];

    for (let i = 0; i < amount; i++) {
        const course = await ctx.prisma.course.create({
            data: courseCreateInputFactory(instructor.id),
        });
        courses.push(course);
    }

    for (const course of courses) {
        // random number of units
        const unitAmount = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < unitAmount; i++) {
            if (course.id === undefined) {
                await ctx.prisma.unit.create({
                    data: unitCreateInputFactory(course.id),
                });
            }
        }
    }

    return courses;
};

export const createInstructor = async () => {
    return userFactory(Role.INSTRUCTOR);
};

export const createStudent = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return userFactory(Role.STUDENT);
    })
};

export const createCourses = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return courseFactory();
    })
};
