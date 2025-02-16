import moment from "moment";
import Link from "next/link";
import { type Course } from "@/types";
import { Tag as AntdTag, Avatar } from "antd";
import { capitalize } from "@/lib/utils";
import { AccessTime, SignalCellularAlt } from "@mui/icons-material";
import { CourseTags } from "./[slug]/CourseTags";

export default function CourseCard({ course }: { course: Course }) {

    return (
        <Link
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
                        <AccessTime fontSize="small" />
                        {moment.duration(course.duration).humanize()}
                        <SignalCellularAlt fontSize="small" />

                        {capitalize(course.difficulty)}
                    </div>
                </AntdTag>
                <h2 className="absolute bottom-0 inset-x-0 p-4 text-lg font-semibold text-white bg-gradient-to-t from-black to-transparent">
                    {course.title}
                </h2>
            </div>

            <div className="grid flex-col grow px-4 py-2 min-h-[175px]">
                <p className="text-black dark:text-gray-400 mb-2">
                    {course.shortDescription}
                </p>

                <CourseTags course={course} />

                <div className="flex justify-end self-end">
                    <AntdTag className="mb-2 p-1 bg-white dark:bg-gray-800 dark:text-gray-400 rounded-2xl">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Course by{" "}
                            <span className="underline">
                                {course?.instructor?.name}
                            </span>
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
