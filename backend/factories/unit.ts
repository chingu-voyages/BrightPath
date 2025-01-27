import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";

type Unit = Prisma.UnitGetPayload<{}>;

export const unitFactory = (): Unit => {
    return {
        id: faker.number.int(),
        ...unitCreateInputWithoutCourseFactory(),
        courseId: faker.number.int(),
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
