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
import { CourseTags } from "./CourseTags";
import { ShareButtons } from "./ShareButtons";

export const dynamic = "force-dynamic";

export default async function Courses({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const res = await fetch(process.env.BACKEND_API_URL + "/courses/" + slug);
    const course: Course = await res.json();
    const isNew = moment(course.createdAt).isAfter(
        moment().subtract(30, "days"),
    );
    const isUpdated =
        course.updatedAt !== course.createdAt &&
        moment(course.updatedAt).isAfter(moment().subtract(30, "days"));

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
                            Course by{" "}
                            <a href="/our-team">{course.instructor.name}</a>
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm font-semibold">
                            <SignalCellularAlt />
                            {capitalize(course.difficulty)}
                        </span>
                        <span className="flex items-center space-x-0.5 text-sm font-semibold">
                            <AccessTime fontSize="small" />
                            <span>
                                {moment.duration(course.duration).humanize()}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="md:flex gap-x-8">
                    {/* Course Outline */}
                    <div className="w-3/5 flex flex-col gap-y-8">
                        <div className="flex items-center space-x-4">
                            <Image
                                src="/Logo_Icon.png"
                                width={20}
                                height={20}
                                alt="BrightPath Logo"
                            />
                            <p className="text-xl font-semibold">
                                {course.shortDescription}
                            </p>
                        </div>
                        {!isEnrolled && (
                            <div dangerouslySetInnerHTML={{ __html: course.introVideoUrl }}></div>
                        )}
                        <div className="bg-white border rounded-lg p-6">
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
                            <div>
                                <p className="text-lg mb-2">
                                    {course.description}
                                </p>
                                <CourseTags course={course} />
                            </div>
                        )}

                        <div className="flex flex-col gap-y-8 border rounded-lg bg-white p-5">
                            {isEnrolled &&
                                enrollment.status ===
                                EnrollmentStatus.ACTIVE && (
                                    <div className="">
                                        <h3 className="font-brand text-headline-s font-semibold">
                                            Your Progress
                                        </h3>
                                        <ProgressBar />
                                    </div>
                                )}

                            {isEnrolled && (
                                <div className="">
                                    <div dangerouslySetInnerHTML={{ __html: course.introVideoUrl }}></div>

                                    {/* Course Description */}
                                    <p className="text-lg mb-2">
                                        {course.description}
                                    </p>
                                    <CourseTags course={course} />
                                </div>
                            )}

                            <div className="">
                                {isEnrolled &&
                                    enrollment.status ===
                                    EnrollmentStatus.COMPLETED && (
                                        <>
                                            <h3 className="font-brand text-headline-s font-semibold mb-4">
                                                Here’s your verified certificate
                                            </h3>
                                            <Link
                                                href={`/certificates/${enrollment.certificate.id}`}
                                                className="text-brightpath-slate cursor-pointer"
                                            >
                                                <CertificateComponent
                                                    certificate={
                                                        enrollment.certificate
                                                    }
                                                    isCompact={true}
                                                />
                                            </Link>
                                            <ShareButtons
                                                url={`https://brightpath.courses/certificates/${enrollment.certificate.id}`}
                                            />
                                        </>
                                    )}

                                {(!isEnrolled ||
                                    enrollment.status ===
                                    EnrollmentStatus.ACTIVE) && (
                                        <>
                                            <h3 className="font-brand text-headline-s font-semibold mb-4">
                                                Complete this course to earn your
                                                verified certificate
                                            </h3>
                                            <CertificateComponent
                                                certificate={null}
                                                isCompact={true}
                                            />
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CoursePage>
    );
}
