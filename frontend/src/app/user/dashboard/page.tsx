import { auth } from "@/auth";
import HorizontalCourseCard from "@/components/Course/HorizontalCourseCard";
import { Course, Enrollment, User } from "@prisma/client";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Student dashboard",
    description: "Overwiew of courses...",
};

type EnrollmelntOutput = Enrollment & { course: Course; user: User };

const Dashboard = async () => {
    const session = await auth()!;
    const { user } = session!;
    // enrolls
    const enrollments: EnrollmelntOutput[] = await (
        await fetch(
            `${process.env.BACKEND_API_URL}/user/${user?.id}/enrollments`,
        )
    ).json();
    const finished = enrollments.filter(
        (enrollement) => enrollement.status === "COMPLETED",
    );
    const currents = enrollments.filter(
        (enrollement) => enrollement.status === "ACTIVE",
    );

    return (
        <div className="py-6 flex flex-col items-center gap-2">
            {/* intro */}
            {/* in progress */}
            <section className="bg-slate-50 rounded-lg max-w-fit p-6 border-b border-slate-300">
                <p className="text-lg italic md:w-8/12 border-b border-slate-300 mb-4 w-full">
                    “Success isn't always about greatness. It's about
                    consistency. <br />
                    Consistent hard work leads to success. Greatness will come.”
                    - Dwayne Johnson
                </p>
                <h1 className="text-3xl font-bold mb-4">Continue Learning</h1>
                <div className="flex flex-col gap-4 ">
                    {currents.map((enrollement) => (
                        <HorizontalCourseCard
                            key={enrollement.id}
                            {...enrollement}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h1>Completed Courses</h1>
            </section>

            <section>
                <h1>Recommandations</h1>
            </section>
        </div>
    );
};

export default Dashboard;
