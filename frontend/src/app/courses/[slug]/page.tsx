import { Prisma } from "@prisma/client";

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

    const res = await fetch(process.env.BACKEND_API_URL + "/courses/" + slug);
    const course: Course = await res.json();

    return (
        <div
            key={course.id}
            className="w-full p-4 border border-gray-200"
            data-testid="course"
        >
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-gray-500">{course.shortDescription}</p>

            <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                    {course.difficulty}
                </span>

                <span className="text-sm text-gray-500">{course.duration}</span>
            </div>
            <div className="flex justify-between mt-4">
                <video controls width={200} height={200}>
                    <source src={course.introVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <span className="text-sm text-gray-500">
                    {course?.instructor?.name}
                </span>
            </div>

            <p className="text-sm text-gray-500">{course.description}</p>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Course Outline</h3>
                <ul>
                    {course.units?.map((unit: Unit) => (
                        <li key={unit.id}>{unit.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
