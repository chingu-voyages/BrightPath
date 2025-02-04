import moment from 'moment'
import Link from 'next/link'
import { type Course } from '@/types'

export default function CourseCard({ course }: { course: Course }) {
    return (
        <Link
            key={course.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 bg-white"
            data-testid="course"
            href={`/courses/${course.slug}`}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    {course.difficulty}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {course.shortDescription}
            </p>

            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course?.instructor?.name}
                </span>
            </div>
        </Link>
    )
}
