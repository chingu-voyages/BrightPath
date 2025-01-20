import { createContext } from "../src/context";
import { Role } from "@prisma/client";
import { userFactory, courseFactory } from "../factories/factory";

const prisma = createContext().prisma;

export const createInstructor = async () => {
    const userData = userFactory(Role.INSTRUCTOR);
    const user = await prisma.user.create({ data: userData });
    return user;
};

export const createStudent = async (amount: number = 1) => {
    const students = await Promise.all(
        Array.from({ length: amount }, async () => {
            const student = userFactory(Role.STUDENT);
            return await prisma.user.create({ data: student });
        }),
    );

    return students;
};

export const createCourses = async (amount: number = 1) => {
    const instructor = await createInstructor();

    const courses = await Promise.all(
        Array.from({ length: amount }, async () => {
            const courseData = courseFactory(instructor.id);
            return await prisma.course.create({ data: courseData });
        }),
    );

    return courses;
};
