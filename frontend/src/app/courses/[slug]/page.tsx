import moment from "moment";
import { Assignment, Enrollment, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { computeCourseDuration } from "@/lib/utils";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import AssignmentComponent from "./Assignment";

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}> & { duration: number };

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: { include: { assignments: true } } };
}> & { duration: number; units: Unit[] };

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
        <div className="w-full grid grid-cols-1 gap-y-4 p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {course.title}
                    </h2>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={course.instructor?.image || ""}
                        alt={course.instructor?.name || ""}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600 ml-2">
                        {course.instructor.name}
                    </span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm text-gray-600">
                        {course.difficulty}
                    </span>
                    <span className="text-sm text-gray-600">
                        {moment.duration(course.duration).humanize()}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 mt-2">
                    {course.shortDescription}
                </p>
                <DynamicEnrollButton />
            </div>

            {/* Video & Description */}
            <div className="grid grid-cols-2">
                <video
                    controls
                    className="rounded-lg shadow-sm w-full md:w-2/3"
                >
                    <source src={course.introVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Course Description */}
                <p className="text-sm text-gray-700 mb-6">
                    {course.description}
                </p>
            </div>

            <div className="grid grid-cols-2 text-black">
                {/* Course Outline */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Course Outline
                    </h3>
                    <div className="space-y-4">
                        {course.units?.map((unit: Unit, index) => (
                            <div
                                key={unit.id}
                                className="p-4 border rounded-lg bg-gray-50"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">
                                        Unit {index + 1} -{" "}
                                        {moment
                                            .duration(unit.duration)
                                            .humanize()}
                                    </h4>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {unit.title}
                                </h3>
                                <p className="">{unit.description}</p>
                                {unit.assignments?.map(
                                    (assignment: Assignment) => (
                                        <AssignmentComponent
                                            key={assignment.id}
                                            assignment={assignment}
                                            enrollment={enrollment}
                                            unitId={unit.id}
                                        />
                                    ),
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="">
                        {/* Certificate */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Complete this course to earn your verified
                            certificate
                        </h3>

                        <div className="w-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
                            <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Certificate of Completion
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Sed pellentesque, purus sit
                                    amet luctus venenatis, elit erat pretium
                                    enim, nec ultricies lacus nunc nec nulla.
                                    Nullam nec est ut sapien.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Progress />
                </div>
            </div>
        </div>
    );
}
