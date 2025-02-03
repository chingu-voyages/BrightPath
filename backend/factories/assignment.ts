import { Prisma, AssignmentType } from "@prisma/client";
import { faker } from "@faker-js/faker";

type Assignment = Prisma.AssignmentGetPayload<{}>;

type ReadingAssignment = Prisma.AssignmentGetPayload<{
    include: { ReadingAssignment: true };
}>;

type VideoAssignment = Prisma.AssignmentGetPayload<{
    include: { VideoAssignment: true };
}>;

type QuizAssignment = Prisma.AssignmentGetPayload<{
    include: { QuizAssignment: true };
}>;

export const readingAssignmentFactory = (unitId = faker.number.int()): ReadingAssignment => {
    const id = faker.number.int();
    return {
        id: id,
        ...assignmentCreateInputWithoutUnitFactory(AssignmentType.READING),
        ReadingAssignment: {
            id: faker.number.int(),
            assignmentId: id,
            ...readingAssignmentCreateInputFactory(),
        },
        unitId: unitId,
    };
}

export const videoAssignmentFactory = (unitId = faker.number.int()): VideoAssignment => {
    const id = faker.number.int();
    return {
        id: id,
        ...assignmentCreateInputWithoutUnitFactory(AssignmentType.VIDEO),
        VideoAssignment: {
            id: faker.number.int(),
            assignmentId: id,
            ...videoAssignmentCreateInputFactory(),
        },
        unitId: unitId,
    };
}

export const assignmentFactory = (lessonId = faker.number.int(), type = AssignmentType.READING): Assignment => {
    if (type === AssignmentType.READING) {
        return readingAssignmentFactory(lessonId);
    }

    if (type === AssignmentType.VIDEO) {
        return videoAssignmentFactory(lessonId);
    }

    return {
        id: faker.number.int(),
        ...assignmentCreateInputWithoutUnitFactory(),
        unitId: lessonId,
    };
};

export const assignmentCreateInputFactory = (
    lessonId: number,
): Prisma.AssignmentCreateInput => {
    return {
        ...assignmentCreateInputWithoutUnitFactory(),
        unit: {
            connect: { id: lessonId },
        },
    };
};

export const assignmentCreateInputWithoutUnitFactory = (type: AssignmentType = AssignmentType.READING) => {
    const title = faker.word.noun(4);

    return {
        title: title,
        type: type,
        description: faker.lorem.paragraph(),
    };
}

export const readingAssignmentCreateInputFactory = () => {
    return {
        content: faker.lorem.paragraph(),
    };
}

export const videoAssignmentCreateInputFactory = () => {
    return {
        videoUrl: faker.internet.url(),
        transcript: faker.lorem.paragraph(),
    };
}
