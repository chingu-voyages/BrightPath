import { createContext } from "../src/context";
import {
    createPersistentCourse,
    cleanDatabase,
    createPersistentStudent,
} from "../tests/utils";

const ctx = createContext();

(async () => {
    await cleanDatabase(ctx);

    await createPersistentCourse(ctx, 10);
    await createPersistentCourse(ctx, 10);

    await createPersistentStudent(ctx, 10);
})();
