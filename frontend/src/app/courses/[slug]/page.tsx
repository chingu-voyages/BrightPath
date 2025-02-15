import moment from "moment";
import { auth } from "@/auth";
import { computeCourseDuration } from "@/lib/utils";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import CoursePage from "./Course";
import ProgressBar from "./ProgressBar";
import { Course, Unit } from "@/types";
import { UnitComponent } from "./Unit";
import { EnrollmentStatus } from "@prisma/client";
import { CertificateComponent } from "@/app/certificates/[slug]/CertificateComponent";
import { isBuiltin } from "module";

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
    let enrollment = null;

    if (user) {
        const res = await fetch(
            `${process.env.BACKEND_API_URL}/user/${user.id}/enrollments`,
        );
        const enrollments = await res.json();
        enrollment = enrollments.find(
            (enrollment: any) => enrollment.courseId === course.id,
        );
        isEnrolled = !!enrollment;

        if (enrollment && enrollment.certificate) {
            enrollment.certificate.enrollment = enrollment;
        }
    }

    return (
        <CoursePage course={course} enrollment={enrollment}>
            <div className="w-full grid grid-cols-1 gap-y-6 p-6 my-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
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
                    <EnrollButton />
                </div>

                {/* Video & Description */}
                {!isEnrolled && (
                    <div className="grid grid-cols-2">
                        <video
                            controls
                            className="rounded-lg shadow-sm w-full md:w-2/3"
                        >
                            <source
                                src={course.introVideoUrl}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>

                        {/* Course Description */}
                        <p className="text-sm text-gray-700 mb-6">
                            {course.description}
                        </p>
                    </div>
                )}

                <div className="md:flex gap-x-8 text-black">
                    {/* Course Outline */}
                    <div className="w-3/5">
                        <div>
                            {course.units?.map((unit: Unit, index: number) => (
                                <UnitComponent
                                    key={unit.id}
                                    unit={unit}
                                    n={index}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-2/5">
                        {isEnrolled &&
                            enrollment.status === EnrollmentStatus.ACTIVE && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Your Progress
                                    </h3>
                                    <ProgressBar />
                                </div>
                            )}

                        {isEnrolled && (
                            <div className="">
                                <video
                                    controls
                                    className="rounded-lg shadow-sm w-full mb-4"
                                >
                                    <source
                                        src={course.introVideoUrl}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Course Description */}
                                <p className="text-sm text-gray-700 mb-6">
                                    {course.description}
                                </p>
                            </div>
                        )}
                        <hr className="my-4" />
                        <div className="">
                            {/* Certificate */}
                            {isEnrolled &&
                                enrollment.status ===
                                    EnrollmentStatus.COMPLETED && (
                                    <>
                                        <h3 className="font-brand text-2xl font-semibold text-gray-900 mb-4">
                                            Here’s your verified certificate
                                        </h3>
                                        <CertificateComponent
                                            certificate={enrollment.certificate}
                                        />
                                    </>
                                )}

                            {(!isEnrolled ||
                                enrollment.status ===
                                    EnrollmentStatus.ACTIVE) && (
                                <>
                                    <h3 className="font-brand text-lg font-semibold text-gray-900 mb-4">
                                        Complete this course to earn your
                                        verified certificate
                                    </h3>
                                    <div className="w-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                Certificate of Completion
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit. Sed
                                                pellentesque, purus sit amet
                                                luctus venenatis, elit erat
                                                pretium enim, nec ultricies
                                                lacus nunc nec nulla. Nullam nec
                                                est ut sapien.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CoursePage>
    );
}
