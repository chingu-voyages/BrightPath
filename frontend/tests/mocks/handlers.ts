import { http, HttpResponse } from "msw";
import { courses, students } from "./data.json";

export const handlers = [
    http.get(process.env.BACKEND_API_URL + "/courses", () => {
        return HttpResponse.json(courses);
    }),

    http.get(process.env.BACKEND_API_URL + "/courses/:slug", (req, res) => {
        const slug = req.params.slug;
        const course = courses.find((c) => c.slug === slug);
        if (!course) {
            return HttpResponse.json({ message: "Course not found" });
        }
        return HttpResponse.json(course);
    }),

    // Add handlers for other routes
];
