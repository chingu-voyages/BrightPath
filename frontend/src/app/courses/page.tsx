import { computeCourseDuration, getRandomQuote } from "@/lib/utils";
import { type Course } from "@/types";
import CourseCard from "./CourseCard";

export const dynamic = "force-dynamic";

export default async function Courses() {
    const res = await fetch(process.env.BACKEND_API_URL + "/courses");
    const courses: Course[] = await res.json();

    for (const course of courses) {
        computeCourseDuration(course);
    }

    return (
        <div className="my-6">
            <h2 className="text-3xl font-bold mb-6">BrightPath Courses</h2>

            <div className="mb-6">{getRandomQuote()}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {courses.map((course: Course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
