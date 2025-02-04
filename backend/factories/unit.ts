import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { assignmentFactory } from "./assignment";

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}>;

export const unitFactory = (courseId = faker.number.int()): Unit => {
    const id = faker.number.int();
    const assignments = Array.from(
        { length: faker.number.int({ min: 1, max: 10 }) },
        () => assignmentFactory(id),
    );

    return {
        id: id,
        ...unitCreateInputWithoutCourseFactory(),
        courseId: courseId,
        assignments: assignments,
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
        description: faker.lorem.paragraphs(2),
    };
};
