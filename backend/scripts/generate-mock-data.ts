import { writeFileSync } from "fs";
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
