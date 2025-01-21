import { createContext } from "../src/context";
import { createCourses, createStudent } from "../tests/utils";

const prisma = createContext().prisma;

(async () => {
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    const students = await createStudent(10);
    await createCourses(5);
    await createCourses(5);
    await createCourses(5);
})();
