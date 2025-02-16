import { type Course } from "@/types";
import { Tag } from "antd";
import moment from "moment";

export const CourseTags = ({ course }: { course: Course }) => {

    const isNew = moment(course.createdAt).isAfter(
        moment().subtract(30, "days"),
    );

    const isUpdated = course.updatedAt !== course.createdAt &&
        moment(course.updatedAt).isAfter(moment().subtract(30, "days"));

    return (
        <div className="flex flex-wrap items-center gap-y-1">
            {isNew && (
                <Tag className="bg-brightpath-blue border-none text-white dark:border-solid dark:bg-gray-800 dark:text-gray-400">
                    New
                </Tag>
            )}
            {
                isUpdated && (
                    <Tag className="dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Updated
                    </Tag>
                )
            }
            {
                course.tags.map((tag) => (
                    <Tag
                        key={tag.tag.id}
                        className="bg-brightpath-blue-extra-light border-none dark:border-solid dark:bg-gray-800 dark:text-gray-400"
                    >
                        {tag.tag.name}
                    </Tag>
                ))
            }

        </div>
    )
}

