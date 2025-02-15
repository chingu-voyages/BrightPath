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

const testimonials = [
    {
        quote: "Zuwaira really kept our team on track, with great communication, encouragement, and accountability.",
        name: "John Doe",
    },
    {
        quote: "Joseph does a great job demonstrating not only how to use tech tools, but also when and why to use them.",
        name: "Jane Doe",
    },
    {
        quote: "BrightPath is a great place to grow as a professional.",
        name: "John Doe",
    },
];

export const dynamic = "force-dynamic";

export default async function Home() {
    const popularCourses = await getPopularCourses();

    return (
        <>
            {/* Hero Section */}
            <section className="absolute inset-x-0 hero grid min-h-[60vh] text-black overflow-hidden">
                <img
                    src="/hero-image.jpg"
                    alt="Hero"
                    className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 hero-gradient h-full w-full" />

                <div className="container mx-auto">
                    <div className="relative flex items-start justify-center flex-col gap-6 px-6 pb-24 h-full w-full sm:w-1/2 md:w-2/5 text-xl">
                        <Image
                            src="/Logo_WithTagline.png"
                            alt="BrightPath"
                            width={360}
                            height={112}
                        />
                        <p className="-mb-3">
                            Ready to take your dev journey deeper?
                        </p>
                        <p className="">
                            Learn by doing, with hands-on, project-based
                            exercises, and stand out from the crowd with
                            specialized knowledge and skills.
                        </p>
                        <Link href="/courses" className="button">
                            Start learning
                        </Link>
                    </div>
                </div>
            </section>
            <div className="h-[60vh]" />
            {/* Courses Section */}
            <section className="mt-12">
                <h2 className="heading font-light">Featured Courses</h2>
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

            <div className="text-headline-m font-light border-y py-4 my-8 text-center">
                The BrightPath platform and courses were created by a
                multidisciplinary team of software development professionals who
                want to give back to our community as we learn in public.
            </div>

            {/* Testimonials */}
            <section className="mt-12">
                <h2 className="heading font-light text-right after:bg-right">
                    Testimonials
                </h2>
                <div className="flex flex-col gap-y-8 px-12">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="border shadow-md bg-white flex odd:mr-auto odd:flex-row-reverse odd:ml-16 even:ml-auto even:mr-16 w-1/2 h-32"
                        >
                            <div className="w-1/3 bg-blue-900 h-full"></div>
                            <div className="w-2/3 px-4 py-3">
                                <p>"{testimonial.quote}"</p>

                                <span className="font-bold italic">
                                    {testimonial.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Certification */}
            <section className="mt-12">
                <h2 className="heading font-light">Certified learning.</h2>
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
