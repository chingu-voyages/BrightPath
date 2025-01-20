import { writeFileSync } from "fs";
import { createContext } from "../src/context";
import { createStudent, createCourses } from "../tests/utils";

(async () => {
    const students = await createStudent(10);
    const courses = await createCourses(5);

    const mockData = {
        students,
        courses,
    };

    writeFileSync("./mockData.json", JSON.stringify(mockData));
})();

console.log("Mock data generated successfully!");
console.log("Cleaning up...");

const prisma = createContext().prisma;

prisma.user.deleteMany();
prisma.course.deleteMany();
