"use client";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Enrollment } from "@/types";
import { CoursePageContext } from "@/app/courses/[slug]/Course";
import ProgressBar from "@/app/courses/[slug]/ProgressBar";
import { EnrollmentStatus } from "@prisma/client";
import EnrollButton from "@/app/courses/[slug]/EnrollButton";

const HorizontalCourseCard = ({ enrollment }: { enrollment: Enrollment }) => {
    const course = enrollment.course;
    const completed = enrollment.status === EnrollmentStatus.COMPLETED;
    const setEnrolled = () => null;

    return (
        <CoursePageContext.Provider
            value={{ course, enrolled: enrollment, setEnrolled }}
        >
            <article className="flex flex-col md:flex-row border-2 rounded-lg bg-white overflow-hidden">
                <figure className="relative w-full min-h-32 md:w-1/4 md:min-w-64 mb-2 md:mb-0 overflow-hidden">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="absolute inset-0 object-cover w-full h-full"
                    />
                </figure>

                <div className="flex-1 p-4">
                    <div className="mb-4">
                        <h3 className="text-2xl font-semibold">
                            {course.title}
                        </h3>
                        <p className="text-sm">
                            Taught by {course.instructor.name}
                        </p>
                    </div>

                    <div className="w-full mb-4 md:flex justify-between gap-4 lg:items-center">
                        <div className="flex-1 md:pr-4 clip max-h-24">
                            {course.shortDescription}
                        </div>
                        {completed ? (
                            <Link
                                className="max-w-fit lg:w-full button"
                                href={
                                    "/certificates/" +
                                    enrollment.certificate?.id
                                }
                            >
                                View certificate
                            </Link>
                        ) : (
                            <Link
                                className="button"
                                href={`/courses/${course.slug}`}
                            >
                                Continue learning
                            </Link>
                        )}
                    </div>

                    {completed ? (
                        <div>
                            <CheckCircleOutlined />
                            <span className="pl-2">
                                Completed on{" "}
                                {moment(enrollment.updatedAt).format("LL")}
                            </span>
                        </div>
                    ) : (
                        <div className="">
                            <ProgressBar />
                        </div>
                    )}
                </div>
            </article>
        </CoursePageContext.Provider>
    );
};

export default HorizontalCourseCard;
