import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";

type User = Prisma.UserGetPayload<{}>;

export const userFactory = (role: Role = Role.STUDENT): User => {
    return {
        id: faker.number.int(),
        email: faker.internet.email(),
        username: faker.internet.username(),
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar(),
        role,
    };
};

export const userCreateInputFactory = (
    role: Role = Role.STUDENT,
): Prisma.UserCreateInput => {
    return {
        email: faker.internet.email(),
        username: faker.internet.username(),
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar(),
        role,
    };
};
