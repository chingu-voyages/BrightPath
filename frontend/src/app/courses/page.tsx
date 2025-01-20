import { type Course } from "@prisma/client";

export default async function Courses() {
    const res = await fetch(process.env.BACKEND_API_URL + "/courses");
    const courses: Course[] = await res.json();

    return (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
            {courses.map((course: Course) => (
                <div
                    key={course.id}
                    className="p-4 border border-gray-200"
                    data-testid="course"
                >
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                            {course.difficulty}
                        </span>

                        <span className="text-sm text-gray-500">
                            {course.duration}
                        </span>
                    </div>
                    <img src={course.thumbnail} alt={course.title} width={200} height={200} />
                    <h2 className="text-lg font-semibold">{course.title}</h2>
                    <p className="text-sm text-gray-500">
                        {course.description}
                    </p>
                    
                    <div className="flex justify-between mt-4">
                        <span className="text-sm text-gray-500">
                            {course?.instructor?.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
