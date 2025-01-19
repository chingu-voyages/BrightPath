import { createCourses } from "../tests/utils";

(async () => {
    const courses = await createCourses(5);
    console.log(courses);
})();
