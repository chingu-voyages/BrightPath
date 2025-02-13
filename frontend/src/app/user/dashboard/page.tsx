import { auth } from "@/auth";
import CourseCard from "@/app/courses/CourseCard";
import HorizontalCourseCard from "@/components/Course/HorizontalCourseCard";
import { MoreHorizOutlined } from "@mui/icons-material";
import { EnrollmentStatus } from "@prisma/client";
import { Course, Enrollment } from "@/types";
import { Metadata } from "next";
import { computeCourseDuration, getRandomQuote } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Student dashboard",
    description: "Course overview",
};

const Dashboard = async () => {
    const session = await auth();
    const user = session?.user;

    const [recommendations, enrollments]: [Course[], Enrollment[]] =
        await Promise.all([
            fetch(`${process.env.BACKEND_API_URL}/courses/popular`).then(
                (res) => res.json(),
            ),
            fetch(
                `${process.env.BACKEND_API_URL}/user/${user?.id}/enrollments`,
            ).then((res) => res.json()),
        ]);

    for (const enrollment of enrollments) {
        computeCourseDuration(enrollment.course);
    }

    const finished = enrollments.filter(
        (enrollment) => enrollment.status === EnrollmentStatus.COMPLETED,
    );
    const current = enrollments.filter(
        (enrollment) => enrollment.status === EnrollmentStatus.ACTIVE,
    );

    return (
        <div className="my-6 flex flex-col gap-6">
            <div>
                <p className="text-xl text-gray-500 mb-8">{getRandomQuote()}</p>
                <h3 className="text-3xl font-bold mb-4">Continue Learning</h3>
                <div className="flex flex-col gap-4 ">
                    {current.map((enrollement) => (
                        <HorizontalCourseCard
                            key={enrollement.id}
                            enrollment={enrollement}
                        />
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold mb-4">Completed courses</h3>
                {finished.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {finished.map((enrollement) => (
                            <HorizontalCourseCard
                                key={enrollement.id}
                                enrollment={enrollement}
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
            </div>

            <div>
                <h3 className="text-3xl font-bold mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl gap-4 ">
                    {recommendations.map((course: any) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
