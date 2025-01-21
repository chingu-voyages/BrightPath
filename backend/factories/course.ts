import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { userFactory } from "./user";

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true, units: true };
}>

type Unit = Prisma.UnitGetPayload<{}>

export const courseFactory = (
    difficulty: Difficulty = Difficulty.BEGINNER,
): Course => {
    const instructor = userFactory(Role.INSTRUCTOR);
    const title = faker.book.title();
    // random number of units
    const units = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => unitFactory());

    return {
        id: faker.number.int(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        title: title,
        slug: faker.helpers.slugify(title),
        shortDescription: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        duration: `${faker.number.int({ min: 1, max: 20 })}h`,
        difficulty: difficulty,
        thumbnail: faker.image.url(),
        published: faker.datatype.boolean(),
        introVideoUrl: faker.internet.url(),
        instructorId: instructor.id,
        instructor: instructor,
        assignmentId: null,
        units: units,
    };
}

export const courseCreateInputFactory = (
    instructorId: number,
    difficulty: Difficulty = Difficulty.BEGINNER,
): Prisma.CourseCreateInput => {
    const title = faker.book.title();

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
        instructor: {
            connect: { id: instructorId },
        },
    };
};

export const unitFactory = (): Unit => {
    const title = faker.lorem.sentence();

    return {
        id: faker.number.int(),
        title: title,
        courseId: faker.number.int(),
    };
}

export const unitCreateInputFactory = (
    courseId: number,
): Prisma.UnitCreateInput => {
    const title = faker.lorem.sentence();

    return {
        title: title,
        course: {
            connect: { id: courseId },
        },
    };
}
