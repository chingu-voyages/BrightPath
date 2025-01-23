import { Context } from "./context";
import { PrismaPromise, Course, Role } from "@prisma/client";
import { userFactory, userCreateInputFactory } from "../factories/user";
import {
    courseFactory,
    unitCreateInputWithoutCourseFactory,
    courseCreateInputWithoutInstructorFactory,
} from "../factories/course";

export const cleanDatabase = async (ctx: Context) => {
    const deleteUnits = ctx.prisma.unit.deleteMany();
    const deleteCourses = ctx.prisma.course.deleteMany();
    const deleteUsers = ctx.prisma.user.deleteMany();

    await ctx.prisma.$transaction([deleteUnits, deleteCourses, deleteUsers]);
};

export const createPersistentCourse = async (
    ctx: Context,
    amount: number = 1,
) => {
    const instructors = await ctx.prisma.user.createManyAndReturn({
        data: Array.from({ length: 3 }, () => {
            return userCreateInputFactory(Role.INSTRUCTOR);
        }),
    });

    const instructor =
        instructors[Math.floor(Math.random() * instructors.length)];

    const courses = await ctx.prisma.course.createManyAndReturn({
        data: Array.from({ length: amount }, () => {
            return {
                ...courseCreateInputWithoutInstructorFactory(),
                instructorId: instructor.id,
            };
        }),
        include: {
            instructor: true,
        },
        skipDuplicates: true,
    });

    for (const course of courses) {
        await ctx.prisma.unit.createMany({
            data: Array.from(
                { length: Math.floor(Math.random() * 10) + 1 },
                () => {
                    return {
                        ...unitCreateInputWithoutCourseFactory(),
                        courseId: course.id,
                    };
                },
            ),
        });
    }

    return courses;
};

export const createPersistentStudent = async (
    ctx: Context,
    amount: number = 1,
) => {
    return ctx.prisma.user.createManyAndReturn({
        data: Array.from({ length: amount }, () => {
            return userCreateInputFactory(Role.STUDENT);
        }),
    });
};

export const createInstructor = async () => {
    return userFactory(Role.INSTRUCTOR);
};

export const createStudent = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return userFactory(Role.STUDENT);
    });
};

export const createCourses = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return courseFactory();
    });
};
