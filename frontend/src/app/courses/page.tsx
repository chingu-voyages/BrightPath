import Link from "next/link";
import { type Prisma } from "@prisma/client";
import { computeCourseDuration } from "@/lib/utils";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Tag, Avatar } from "antd";

import moment from "moment";

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true };
}> & { duration: number };

export const dynamic = "force-dynamic";

export default async function Courses() {
    const res = await fetch(process.env.BACKEND_API_URL + "/courses");
    const courses: Course[] = await res.json();
    for (const course of courses) {
        computeCourseDuration(course);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {courses.map((course: Course) => (
                <Link
                    key={course.id}
                    className="grid p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 bg-white"
                    data-testid="course"
                    href={`/courses/${course.slug}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            {course.difficulty == "BEGINNER" && (
                                <SignalCellularAlt1BarIcon />
                            )}
                            {course.difficulty == "INTERMEDIATE" && (
                                <SignalCellularAlt2BarIcon />
                            )}
                            {course.difficulty == "ADVANCED" && (
                                <SignalCellularAltIcon />
                            )}

                            {course.difficulty}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            <AccessTimeIcon className="mr-2" />
                            {moment.duration(course.duration).humanize()}
                        </span>
                    </div>
                    <div className="relative h-40 mb-2 overflow-hidden rounded-lg">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            width={200}
                            height={200}
                            className="absolute inset-0 object-cover object-center w-full h-full"
                        />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {course.title}
                    </h2>
                    <div className="flex-wrap items-center">
                        {/* Hard coded values to be removed later */}
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Code
                        </Tag>
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Design
                        </Tag>
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Tailwind
                        </Tag>
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Tailwind
                        </Tag>
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Tailwind
                        </Tag>
                        <Tag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Tailwind
                        </Tag>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {course.shortDescription}
                    </p>

                    <div className="flex justify-end self-end">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {course?.instructor?.name}
                            <Avatar
                                className="ml-2"
                                src={course.instructor.image}
                            />
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
