import { type Course } from "@/types";
import CourseCard from "./courses/CourseCard";
import Image from "next/image";
import Link from "next/link";

const getPopularCourses = async () => {
    const res = await fetch(process.env.BACKEND_API_URL + "/courses/popular");

    if (!res.ok) {
        return [];
    }

    return await res.json();
};

export const dynamic = "force-dynamic";

export default async function Home() {
    const popularCourses = await getPopularCourses();

    return (
        <>
            {/* Hero Section */}
            <section className="hero relative grid min-h-[50vh] text-black overflow-hidden">
                <img
                    src="/hero-image.jpg"
                    alt="Hero"
                    className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 hero-gradient h-full w-full" />

                <div className="relative flex items-start justify-center flex-col px-6 pb-24 h-full w-full sm:w-1/2 md:w-2/5">
                    <Image
                        src="/logo.svg"
                        alt="BrightPath"
                        width={300}
                        height={300}
                    />
                    <p className="text-gray-700 mb-4">
                        Ready to take your dev journey deeper?
                    </p>
                    <p className="text-gray-700">
                        Learn by doing, with hands-on, project-based exercises,
                        and stand out from the crowd with specialized knowledge
                        and skills.
                    </p>
                    <Link href="/courses">Start learning</Link>
                </div>
            </section>

            {/* Courses Section */}
            <section className="mt-12">
                <h2 className="text-3xl font-bold mb-6">BrightPath Courses</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {popularCourses.map((course: Course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                <div className="flex items-center justify-center mt-6">
                    <Link href="/courses" className="">
                        View all courses
                    </Link>
                </div>
            </section>

            {/* Testimonials */}
            <section className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Testimonials</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        "Zuaida really kept our team on track.",
                        "Joseph does a great job demonstrating tech tools.",
                        "BrightPath is a great place to grow as a developer.",
                    ].map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="border p-6 rounded-lg shadow-md bg-white text-gray-700"
                        >
                            {testimonial}
                        </div>
                    ))}
                </div>
            </section>

            {/* Certification */}
            <section className="mt-12 bg-gray-100 p-6 rounded-lg text-black">
                <h2 className="text-3xl font-bold mb-6">Certified learning.</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border p-6 rounded-lg bg-white text-center">
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-gray-700 text-sm mt-2">
                            Has successfully completed all coursework and
                            assignments for the course
                        </p>
                        <p className="text-lg font-bold mt-2">
                            Bring Your App to Life with Tailwind Motion
                        </p>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-700 text-lg">
                            Our verified certificates highlight your
                            specialization and skills.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
