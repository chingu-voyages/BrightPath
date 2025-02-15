import moment from "moment";
import { auth } from "@/auth";
import { capitalize, computeCourseDuration } from "@/lib/utils";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import CoursePage from "./Course";
import ProgressBar from "./ProgressBar";
import { Course, Unit } from "@/types";
import { UnitComponent } from "./Unit";
import { EnrollmentStatus } from "@prisma/client";
import { CertificateComponent } from "@/app/certificates/[slug]/CertificateComponent";
import { AccessTime, SignalCellularAlt } from "@mui/icons-material";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Courses({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const res = await fetch(process.env.BACKEND_API_URL + "/courses/" + slug);
    const course: Course = await res.json();
    const isNew = moment(course.createdAt).isAfter(moment().subtract(30, "days"));
    const isUpdated = course.updatedAt !== course.createdAt && moment(course.updatedAt).isAfter(moment().subtract(30, "days"));

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
            <div className="w-full grid grid-cols-1 gap-y-8 p-6 my-6">
                <div className="flex justify-start items-center">
                    {isNew && (
                        <span className="bg-brightpath-blue text-white text-xs font-semibold px-2 py-1 rounded mr-4">
                            New
                        </span>
                    )}
                    <div>
                        <h2 className="text-headline-l font-semibold text-brighpath-slate">
                            {course.title}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={course.instructor?.image || ""}
                            alt={course.instructor?.name || ""}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm ml-2">
                            Course by <a href="/our-team">{course.instructor.name}</a>
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold">
                            <SignalCellularAlt />
                            {capitalize(course.difficulty)}
                        </span>
                        <span className="text-sm font-semibold">
                            <AccessTime fontSize="small" />
                            {moment.duration(course.duration).humanize()}
                        </span>
                    </div>
                </div>

                <div className="md:flex gap-x-8 text-black">
                    {/* Course Outline */}
                    <div className="w-3/5 flex flex-col gap-y-8">
                        <div className="flex items-center space-x-4">
                            <Image src="/Logo_Icon.png" width={20} height={20} alt="BrightPath Logo" />
                            <p className="text-xl font-semibold">
                                {course.shortDescription}
                            </p>
                        </div>
                        {!isEnrolled && (
                            <video
                                controls
                                className="rounded-lg shadow-sm w-full"
                            >
                                <source
                                    src={course.introVideoUrl}
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        )}
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

                    <div className="w-2/5 flex flex-col gap-y-8">
                        <div className="flex items-center justify-end">
                            <EnrollButton />
                        </div>

                        {!isEnrolled && (
                            <p className="text-xl">
                                {course.description}
                            </p>
                        )}

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
                                <p className="text-xl">
                                    {course.description}
                                </p>
                            </div>
                        )}

                        <div className="">
                            <hr className="my-4" />
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
