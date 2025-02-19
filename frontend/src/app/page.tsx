import { type Course } from "@/types";
import CourseCard from "./courses/CourseCard";
import Image from "next/image";
import Link from "next/link";
import { computeCourseDuration } from "@/lib/utils";
import { CertificateComponent } from "./certificates/[slug]/CertificateComponent";
import {
    ArrowCircleRight,
    ArrowCircleRightOutlined,
    Article,
    Star,
} from "@mui/icons-material";

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

    for (const course of popularCourses) {
        computeCourseDuration(course);
    }

    return (
        <>
            {/* Hero Section */}
            <section className="absolute inset-x-0 hero grid min-h-[60vh] text-black overflow-hidden">
                <img
                    src="/hero-image.jpg"
                    alt="Hero"
                    className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 hero-gradient h-full w-full"></div>

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
                            <span className="mr-2">Start learning</span>
                            <ArrowCircleRightOutlined />
                        </Link>
                    </div>
                </div>
            </section>
            <div className="h-[60vh]" />
            {/* Courses Section */}
            <section className="relative mt-12">
                <div className="featured-courses-vector absolute left-0 top-0">
                    <Image
                        src="/featured-courses-vector.svg"
                        alt="Vector"
                        width={400}
                        height={400}
                        className="h-full"
                    />
                </div>
                <h2 className="relative heading font-light">
                    Featured Courses
                </h2>
                <div className="relative grid md:grid-cols-3 gap-6">
                    {popularCourses.map((course: Course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                <div className="flex items-center justify-center mt-6">
                    <Link href="/courses" className="button">
                        <span className="mr-2">View all courses</span>
                        <ArrowCircleRightOutlined />
                    </Link>
                </div>
            </section>

            <div className="text-headline-m font-light border-y py-4 my-8 text-center">
                The BrightPath platform and courses were created by a
                 multidisciplinary team of software development professionals
                who want to  give back to our community as we learn in public.
            </div>

            {/* Testimonials */}
            <section className="relative mt-12">
                <div className="absolute top-0 w-full flex justify-center">
                    <Image
                        src="/testimonials-vector.svg"
                        alt="Vector"
                        width={240}
                        height={600}
                        className="h-full ml-16"
                    />
                </div>
                <h2 className="relative heading font-light text-right after:bg-right">
                    Testimonials
                </h2>
                <div className="relative flex flex-col gap-y-8 px-12">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="border shadow-md bg-white flex odd:mr-auto odd:flex-row-reverse odd:ml-16 even:ml-auto even:mr-16 w-full md:w-1/2 h-40 md:h-32"
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
            <section className="mt-16">
                <h2 className="heading font-light">Certified learning.</h2>
                <div className="sm:flex">
                    <div className="sm:w-1/5 p-5 lg:mt-24 rounded-md border-y border-l h-fit text-brightpath-blue-xdark font-semibold bg-brightpath-blue-extra-light">
                        <Article fontSize="large" className="mb-2" />
                        <p>
                            Share your certificate on LinkedIn, your portfolio,
                            and more
                        </p>
                    </div>
                    <CertificateComponent certificate={null} />

                    <div className="sm:w-1/5 p-5 lg:mt-auto lg:mb-12 rounded-md border-y border-r h-fit text-brightpath-blue-xdark font-semibold bg-brightpath-blue-extra-light">
                        <Star fontSize="large" className="mb-2" />
                        <p>
                            Verified certificates highlight your specialization
                            and skills
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
