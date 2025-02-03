import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { assignmentFactory } from "./assignment";

type Lesson = Prisma.LessonGetPayload<{
    include: { assignments: true };
}>;

export const lessonFactory = (unitId = faker.number.int()): Lesson => {
    const id = faker.number.int();
    const assignments = Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => assignmentFactory(id),
    );

    return {
        id: id,
        ...lessonCreateInputWithoutUnitFactory(),
        unitId: unitId,
        assignments: assignments,
    };
};

export const lessonCreateInputFactory = (
    unitId: number,
): Prisma.LessonCreateInput => {
    return {
        ...lessonCreateInputWithoutUnitFactory(),
        unit: {
            connect: { id: unitId },
        },
    };
};

export const lessonCreateInputWithoutUnitFactory = () => {
    const title = faker.word.noun(4);

    return {
        title: title,
        description: faker.lorem.paragraph(),
    };
};

