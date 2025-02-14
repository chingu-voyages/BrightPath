import moment from "moment";
import Link from "next/link";
import { type Course } from "@/types";

import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Tag as AntdTag, Avatar } from "antd";

export default function CourseCard({ course }: { course: Course }) {
    return (
        <Link
            key={course.id}
            className="grid border bg-white dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 bg-white"
            data-testid="course"
            href={`/courses/${course.slug}`}
        >
            <div className="relative h-48 mb-2 overflow-hidden rounded-t-lg">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    width={200}
                    height={200}
                    className="absolute inset-0 object-cover object-center w-full h-full"
                />
                <AntdTag className="absolute border-none top-2 right-2 bg-black bg-opacity-50 text-white">
                    <div className="flex items-center gap-0.5 text-xs">
                        <AccessTimeIcon fontSize="small" />
                        {moment.duration(course.duration).humanize()}
                        <SignalCellularAltIcon />

                        {course.difficulty}
                    </div>
                </AntdTag>
                <h2 className="absolute bottom-1 left-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {course.title}
                </h2>
            </div>

            <div className="grid flex-col grow px-2 pb-2 min-h-[175px]">
                <div className="flex-wrap items-center ml-2">
                    {(Date.now() - new Date(course.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24 * 30) <
                        3 && (
                        <AntdTag className="mb-2 bg-cyan-600 border-none text-white dark:border-solid dark:bg-gray-800 dark:text-gray-400">
                            New
                        </AntdTag>
                    )}
                    {(Date.now() - new Date(course.updatedAt).getTime()) /
                        (1000 * 60 * 60 * 24 * 30) <
                        3 && (
                        <AntdTag className="mb-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Updated
                        </AntdTag>
                    )}
                    {course.tags.map((tag) => (
                        <AntdTag
                            key={tag.tag.id}
                            className="mb-2 bg-sky-100 border-none dark:border-solid dark:bg-gray-800 dark:text-gray-400"
                        >
                            {tag.tag.name}
                        </AntdTag>
                    ))}
                </div>

                <p className="text-sm dark:text-gray-400 mb-2">
                    {course.shortDescription}
                </p>

                <div className="flex justify-end self-end">
                    <AntdTag className="mb-2 p-1 bg-sky-100 dark:bg-gray-800 dark:text-gray-400 rounded-2xl">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Course by {course?.instructor?.name}
                            <Avatar
                                size={25}
                                className="ml-2"
                                src={course.instructor.image}
                            />
                        </span>
                    </AntdTag>
                </div>
            </div>
        </Link>
    );
}
