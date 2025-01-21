import { Context } from "./context";
import { Course, Role } from "@prisma/client";
import { userFactory, userCreateInputFactory } from "../factories/user";
import { courseFactory, courseCreateInputFactory } from "../factories/course";

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
