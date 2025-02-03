import { Prisma, AssignmentType  } from "@prisma/client";
import { faker } from "@faker-js/faker";

type Assignment = Prisma.AssignmentGetPayload<{}>;

type ReadingAssignment = Prisma.AssignmentGetPayload<{
    include: { ReadingAssignment: true };
}>;

export const readingAssignmentFactory = (): ReadingAssignment => {
    const id = faker.number.int();
    return {
        id: id,
        ...assignmentCreateInputWithoutLessonFactory(AssignmentType.READING),
        ReadingAssignment: {
            id: faker.number.int(),
            assignmentId: id,
            content: faker.lorem.paragraph(),
        },
        lessonId: faker.number.int(),
    };
}

export const assignmentFactory = (lessonId = faker.number.int()): Assignment => {
    return {
        id: faker.number.int(),
        ...assignmentCreateInputWithoutLessonFactory(),
        lessonId: lessonId,
    };
};

export const assignmentCreateInputFactory = (
    lessonId: number,
): Prisma.AssignmentCreateInput => {
    return {
        ...assignmentCreateInputWithoutLessonFactory(),
        lesson: {
            connect: { id: lessonId },
        },
    };
};

export const assignmentCreateInputWithoutLessonFactory = (type = AssignmentType.READING) => {
    const title = faker.word.noun(4);

    return {
        title: title,
        type: type,
        description: faker.lorem.paragraph(),
    };
}
