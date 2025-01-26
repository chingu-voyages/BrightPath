import { Prisma } from "@prisma/client";
import EnrollButton from "./EnrollButton";
import { auth } from "@/auth";

type Course = Prisma.CourseGetPayload<{
    include: { instructor: true; units: true };
}>;

type Unit = Prisma.UnitGetPayload<{}>;

export const dynamic = "force-dynamic";

export default async function Courses({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const session = await auth();
    const user = session?.user;

    if (user) {
        // fetch enrollments to check if user is already enrolled
        // const enrollments = await fetch(process.env.BACKEND_API_URL + "/users/" + user.id + "/enrollments")
    }

    const res = await fetch(process.env.BACKEND_API_URL + "/courses/" + slug);
    const course: Course = await res.json();

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

                <EnrollButton userId={user?.id} slug={slug} />
            </div>

            <div className="flex justify-start items-center mb-4">
                <span className="mr-3 text-sm text-gray-500 dark:text-gray-400">
                    {course.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                </span>
            </div>

            <div className="flex items-start justify-between mb-4 gap-4">
                <video
                    controls
                    className="rounded-lg shadow-sm max-h-40 max-w-[50%]"
                >
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

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {course.description}
            </p>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Course Outline
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {course.units?.map((unit: Unit) => (
                        <li key={unit.id}>{unit.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
