import { Assignment, Enrollment, Prisma } from "@prisma/client";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { auth } from "@/auth";
import Link from "next/link";
import EnrollButton from "./EnrollButton";

dayjs.extend(duration);
dayjs.extend(relativeTime)

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: string };

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: { include: { assignments: true } } };
}> & { duration: string, units: Unit[] };


const computeCourseDuration = (course: any) => {
    const totalDuration = dayjs.duration(0);

    course.units.forEach((unit: any) => {
        const unitDuration = computeDurationForUnit(unit);
        totalDuration.add(unitDuration);
    });

    course.duration = totalDuration.humanize();
};

const computeDurationForUnit = (unit: Unit) => {
    let totalDuration = dayjs.duration(0);
    unit.assignments.forEach((assignment: Assignment) => {
        const parsedDuration = dayjs(assignment.duration);
        const duration = dayjs.duration({
            hours: parsedDuration.hour(),
            minutes: parsedDuration.minute(),
        });


        totalDuration = totalDuration.add(duration);
    });

    unit.duration = totalDuration.humanize();

    return totalDuration
};

const formatDuration = (duration: string | Date): string => {
    const d = dayjs(duration, 'HH:mm')
    const hours = d.hour();
    const minutes = Math.round(d.minute() / 5) * 5;

    return dayjs().hour(hours).minute(minutes).format('HH:mm');
};

export const dynamic = "force-dynamic";

export default async function Courses({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const res = await fetch(process.env.BACKEND_API_URL + "/courses/" + slug);
    const course: Course = await res.json();
    computeCourseDuration(course);

    const session = await auth();
    const user = session?.user;
    let isEnrolled = false;
    let enrollment: Enrollment;

    if (user) {
        const res = await fetch(
            `${process.env.BACKEND_API_URL}/user/${user.id}/enrollments`,
        );
        const enrollments = await res.json();
        enrollment = enrollments.find(
            (enrollment: any) => enrollment.courseId === course.id,
        );
        isEnrolled = !!enrollment;
    }

    const DynamicEnrollButton = () => {
        if (isEnrolled) {
            return (
                <button
                    disabled
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Enrolled
                </button>
            );
        }

        if (user && user.id) {
            return <EnrollButton courseId={course.id} userId={user.id} />;
        }

        return <Link href="/auth/signin">Enroll</Link>;
    };

    const Progress = () => {
        if (!isEnrolled) {
            return null;
        }

        const percentage = enrollment.progress * 100;

        return (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner">
                <div
                    className="h-2 bg-blue-500 rounded-lg"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    };

    return (
        <div
            key={course.id}
            className="w-full p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 bg-white"
            data-testid="course"
        >
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {course.title}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {course.shortDescription}
                    </p>
                </div>

                <DynamicEnrollButton />
            </div>

            <div className="flex justify-start items-center mb-4">
                <span className="mr-3 text-sm text-gray-500 dark:text-gray-400">
                    {course.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                </span>
            </div>

            <div className="md:flex items-start justify-between mb-4 gap-4">
                <video controls className="rounded-lg shadow-sm max-h-40">
                    <source src={course.introVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="flex flex-col items-center border p-6 rounded-lg">
                    <img
                        src={course.instructor?.image || "/avatar.png"}
                        alt={`${course.instructor?.name} Profile`}
                        className="w-16 h-16 rounded-full shadow"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {course.instructor?.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {course.instructor?.bio}
                    </span>
                </div>
            </div>

            <Progress />

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {course.description}
            </p>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Course Outline
                </h3>
                <ul className="list-disc list-inside text-sm text-black space-y-1">
                    {course.units?.map((unit: Unit, index) => (
                        <div key={unit.id} className="mb-4">
                            <div className="flex items-center mb-2">
                                <p>Unit {index + 1}</p>
                                <p>{unit.duration}</p>
                            </div>

                            <h3>{unit.title}</h3>
                            <p>{unit.description}</p>
                            {unit.assignments?.map((assignment: Assignment) => (
                                <div key={assignment.id} className="mb-4 bg-gray-200 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <p>{assignment.type}</p>
                                        <p>{formatDuration(assignment.duration)}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <h4>{assignment.title}</h4>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}
