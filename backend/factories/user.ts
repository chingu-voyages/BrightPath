import { Prisma, Role, Difficulty } from "@prisma/client";
import { faker } from "@faker-js/faker";

type User = Prisma.UserGetPayload<{}>;

export const userFactory = (
    role: Role = Role.STUDENT,
    id: string = faker.string.uuid(),
): User => {
    return {
        id: id,
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar(),
        role,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
};

export const userCreateInputFactory = (
    role: Role = Role.STUDENT,
): Prisma.UserCreateInput => {
    return {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar(),
        role,
    };
};
