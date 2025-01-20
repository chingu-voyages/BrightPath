import { type Course } from "@prisma/client";

export default async function Courses() {
    const res = await fetch(process.env.BACKEND_API_URL + "/courses");
    const courses: Course[] = await res.json();

    return (
        <div className="grid md:grid-cols-3">
            {courses.map((course: Course) => (
                <div
                    key={course.id}
                    className="p-4 border border-gray-200"
                    data-testid="course"
                >
                    <h2 className="text-lg font-semibold">{course.title}</h2>
                    <p className="text-sm text-gray-500">
                        {course.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
