import { createContext } from "../src/context";
import { createPersistentCourse, cleanDatabase } from "../tests/utils";

const ctx = createContext();

(async () => {
    await cleanDatabase(ctx);

    await createPersistentCourse(ctx, 10);
})();
