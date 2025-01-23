import { http, HttpResponse } from "msw";
import { courses, students } from "./data.json";

export const handlers = [
    http.get(process.env.BACKEND_API_URL + "/courses", () => {
        return HttpResponse.json(courses);
    }),

    // Add handlers for other routes
];
