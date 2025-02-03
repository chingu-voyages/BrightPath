import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { lessonFactory } from "./lesson";

type Unit = Prisma.UnitGetPayload<{
    include: { lessons: true };
}>;

export const unitFactory = (courseId = faker.number.int()): Unit => {

    const id = faker.number.int();
    const lessons = Array.from(
        { length: faker.number.int({ min: 1, max: 10 }) },
        () => lessonFactory(id),
    );

    return {
        id: id,
        ...unitCreateInputWithoutCourseFactory(),
        courseId: courseId,
        lessons: lessons,
    };
};

export const unitCreateInputFactory = (
    courseId: number,
): Prisma.UnitCreateInput => {
    return {
        ...unitCreateInputWithoutCourseFactory(),
        course: {
            connect: { id: courseId },
        },
    };
};

export const unitCreateInputWithoutCourseFactory = () => {
    const title = faker.word.noun(4);

    return {
        title: title,
    };
};
