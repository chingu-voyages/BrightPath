import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const userFactory = (
    role: Role = Role.STUDENT,
): Prisma.UserCreateInput => {
    return {
        email: faker.internet.email(),
        username: faker.internet.username(),
        name: faker.person.fullName(),
        image: faker.image.avatar(),
        role,
    };
};

export const courseFactory = (
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
