import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { userFactory } from "./user";

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: true };
}>;

type Unit = Prisma.UnitGetPayload<{}>;

export const courseFactory = (
    difficulty: Difficulty = Difficulty.BEGINNER,
): Course => {
    const instructor = userFactory(Role.INSTRUCTOR);
    // random number of units
    const units = Array.from(
        { length: faker.number.int({ min: 1, max: 10 }) },
        () => unitFactory(),
    );

    return {
        id: faker.number.int(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        ...courseCreateInputWithoutInstructorFactory(difficulty),
        instructorId: instructor.id,
        instructor: instructor,
        assignmentId: null,
        units: units,
    };
};

export const courseCreateInputFactory = (
    instructorId: number,
    difficulty: Difficulty = Difficulty.BEGINNER,
): Prisma.CourseCreateInput => {
    return {
        ...courseCreateInputWithoutInstructorFactory(difficulty),
        instructor: {
            connect: { id: instructorId },
        },
    };
};

export const courseCreateInputWithoutInstructorFactory = (
    difficulty: Difficulty = Difficulty.BEGINNER,
) => {
    const title = faker.word.noun(4);

    return {
        title: title,
        slug: faker.helpers.slugify(title),
        shortDescription: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        duration: `${faker.number.int({ min: 1, max: 20 })}h`,
        difficulty: difficulty,
        thumbnail: faker.image.url(),
        published: faker.datatype.boolean(),
        introVideoUrl: faker.internet.url(),
    };
};

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
