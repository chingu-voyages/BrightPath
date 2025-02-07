import { Course, Enrollment, User } from "@prisma/client";
import {
    CheckCircleOutlined,
    DesktopOutlined,
    RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React from "react";
import { Image, Progress } from "antd";
// import Image from 'next/image';
type Proptype = Enrollment & { course: Course; user: User };
const HorizontalCourseCard = async (props: Proptype) => {
    // const res = await fetch(`${process.env.BACKEND_API_URL}/courses/${id}`);
    // const course: Course = await res.json();

    const { course, user, status, progress } = props;
    const completed = status === "COMPLETED" && true;

    return (
        <article className="flex flex-col md:flex-row w-full max-w-5xl h-full lg:h-56 border-2 border-slate-400  rounded-md ">
            <figure className="relative h-72 lg:h-full w-full md:w-64 mb-2 overflow-hidden">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    width={200}
                    height={200}
                    className="absolute inset-0 object-cover object-center w-full h-full"
                />
            </figure>
            {/*?? details Instructors */}
            <div className="p-4">
                <div>
                    <h1 className="text-2xl font-semibold">{course.title}</h1>
                    <p>Taught by Instructor ????</p>
                </div>

                <div className="w-full flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
                    <p className="lg:w-3/4">{course.shortDescription}</p>
                    {/* ??continue btn or ... */}
                    {completed ? (
                        <Link
                            className="max-w-fit lg:w-full p-6 text-center rounded-md font-semibold text-lg text-slate-100 dark:text-slate-800 bg-slate-700 dark:bg-slate-400"
                            href={"/cerificate/??"}
                        >
                            View certificate
                        </Link>
                    ) : (
                        <Link
                            className="flex gap-2 p-2 px-4 rounded-md min-w-fit w-1/3 lg:w-1/3 text-slate-100 dark:text-slate-800  bg-slate-700 dark:bg-slate-400"
                            href={`/course/${course.id}`}
                        >
                            <div>
                                <p className="text-sm italic font-thin">
                                    Continue learning:
                                </p>

                                <div className="text-lg font-semibold flex justify-center items-center gap-2">
                                    {/* <p>
                                        
                                    </p> */}
                                    <DesktopOutlined
                                        style={{ fontSize: 24, padding: 0 }}
                                    />
                                    {/* ??last chap */}
                                    <p className="">The Agile Process</p>
                                </div>
                            </div>

                            <RightOutlined style={{ fontSize: 12 }} />
                        </Link>
                    )}
                </div>

                {completed ? (
                    <div>
                        {/* ?? completed time */}
                        <CheckCircleOutlined />
                        Completed on date mm dd, yyyy
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between lg:items-center">
                        <Progress
                            className="w-full sm:w-3/4"
                            percent={progress}
                            size={"default"}
                            strokeColor={"gray"}
                            percentPosition={{
                                align: "end",
                                type: "outer",
                            }}
                        />

                        {/* ?? remaining time */}
                        <p className="font-semibold">xx time left</p>
                    </div>
                )}
            </div>
        </article>
    );
};

export default HorizontalCourseCard;
