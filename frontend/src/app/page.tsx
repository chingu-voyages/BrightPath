import { type Course } from "@/types";
import CourseCard from "./courses/CourseCard";

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
            <section className="grid md:grid-cols-2 gap-8 bg-gray-100 p-6 rounded-lg">
                <div>
                    <h1 className="text-4xl font-bold mb-4">
                        Welcome to BrightPath!
                    </h1>
                    <p className="text-gray-700 mb-4">
                        Ready to take your dev journey deeper? Learn by doing,
                        with hands-on project-based exercises, and stand out
                        from the crowd with specialized knowledge and skills.
                    </p>
                    <p className="text-gray-700">
                        The <strong>BrightPath</strong> platform and courses
                        were created by a multidisciplinary team of software
                        development professionals in order to give back to our
                        community as we learn in public.
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <img
                        src="/hero-placeholder.png"
                        alt="Hero"
                        className="rounded-lg"
                    />
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
            <section className="mt-12 bg-gray-100 p-6 rounded-lg">
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
