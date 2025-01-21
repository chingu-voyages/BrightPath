import { createContext } from "../src/context";
import { createPersistentCourse  } from "../tests/utils";

const ctx = createContext();

(async () => {
    await ctx.prisma.course.deleteMany();
    await ctx.prisma.user.deleteMany();

    await createPersistentCourse(ctx, 10);
})();
