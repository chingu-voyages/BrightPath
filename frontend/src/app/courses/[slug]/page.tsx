import moment from "moment";
import { Assignment, Enrollment, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import AssignmentComponent from "./Assignment";

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: number };

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: { include: { assignments: true } } };
}> & { duration: number; units: Unit[] };

const computeCourseDuration = (course: any) => {
    let courseDuration = moment.duration();

    for (const unit of course.units) {
        const unitDuration = moment.duration();

        for (const assignment of unit.assignments) {
            unitDuration.add(assignment.duration);
        }

        unit.duration = unitDuration.asMilliseconds();
        courseDuration.add(unitDuration);
    }

    course.duration = courseDuration.asMilliseconds();
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
                    {moment.duration(course.duration).humanize()}
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
                                <p>Unit {index + 1} - </p>
                                <p>
                                    {moment.duration(unit.duration).humanize()}
                                </p>
                            </div>

                            <h3>{unit.title}</h3>
                            <p>{unit.description}</p>
                            {unit.assignments?.map((assignment: Assignment) => (
                                <AssignmentComponent
                                    key={assignment.id}
                                    assignment={assignment}
                                    enrollment={enrollment}
                                    unitId={unit.id}
                                />
                            ))}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}
