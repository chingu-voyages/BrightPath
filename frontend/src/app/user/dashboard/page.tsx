import CourseCard from "@/app/courses/CourseCard";
import { auth } from "@/auth";
import HorizontalCourseCard from "@/components/Course/HorizontalCourseCard";
import { MoreHorizOutlined } from "@mui/icons-material";
import {
    Course,
    Enrollment,
    EnrollmentStatus,
    Prisma,
    User,
} from "@prisma/client";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Student dashboard",
    description: "Overwiew of courses...",
};

type EnrollmelntOutput = Prisma.EnrollmentGetPayload<{
    include: { course: true; user: true };
}>;

const Dashboard = async () => {
    const session = await auth()!;
  const { user } = session!;
    //!! still type buggy_ish
    const recommandations:any[] = await (
        await fetch(process.env.BACKEND_API_URL + "/courses/popular")
    ).json();
  
    // enrolls
    const enrollments: EnrollmelntOutput[] = await (
        await fetch(
            `${process.env.BACKEND_API_URL}/user/${user?.id}/enrollments`,
        )
    ).json();
    const finished = enrollments.filter(
        (enrollement) => enrollement.status === EnrollmentStatus.COMPLETED,
    );
    const currents = enrollments.filter(
        (enrollement) => enrollement.status === EnrollmentStatus.ACTIVE,
    );

    return (
        <div className="py-6 flex flex-col items-center gap-2">
            <div className="max-w-fit ">
                {/* intro */}
                {/* in progress */}
                <section className="bg-slate-50 rounded-lg max-w-fit p-6 border-b border-slate-300 mb-2">
                    <p className="text-lg italic md:w-8/12 border-b border-slate-300 mb-4 w-full">
                        “Success isn't always about greatness. It's about
                        consistency. <br />
                        Consistent hard work leads to success. Greatness will
                        come.” - Dwayne Johnson
                    </p>
                    <h1 className="text-3xl font-bold mb-4">
                        Continue Learning
                    </h1>
                    <div className="flex flex-col gap-4 ">
                        {currents.map((enrollement) => (
                            <HorizontalCourseCard
                                key={enrollement.id}
                                {...enrollement}
                            />
                        ))}
                    </div>
                </section>
                <section className="bg-slate-50 rounded-lg max-w-full p-6 border-b border-slate-300 mb-2">
                    <h1 className="text-3xl font-bold mb-4">
                        Completed Course
                    </h1>
                    {finished.length > 0 ? (
                        <div className="flex flex-col gap-4 ">
                            {finished.map((enrollement) => (
                                <HorizontalCourseCard
                                    key={enrollement.id}
                                    {...enrollement}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col justify-center  items-center">
                            <MoreHorizOutlined style={{ fontSize: 32 }} />
                            <p className="italic">
                                Nope; Still empty. Want a joke instead? (Just
                                kidding...unless? 😁)
                            </p>
                        </div>
                    )}
                </section>

                <section className="bg-slate-50 rounded-lg max-w-full p-6 border-b border-slate-300 mb-2">
                    <h1 className="text-3xl font-bold mb-4">Recommandations</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl gap-4 ">
                      {/* buggy_ish */}
                        {recommandations.map((course:any) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
