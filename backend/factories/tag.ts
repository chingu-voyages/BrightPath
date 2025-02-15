import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

type Tag = Prisma.TagGetPayload<{}>;

export const tagFactory = (): Tag => {
    return {
        id: faker.number.int(),
        ...tagCreateInputFactory(),
    };
}

export const tagCreateInputFactory = (): Prisma.TagCreateInput => {
    return {
        name: faker.lorem.word(),
    };
};
