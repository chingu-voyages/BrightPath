import request from "supertest";
import app from "../src/app";
import { createContext } from "./context";
import { createCourses } from "./utils";

const prisma = createContext().prisma;

describe("GET /courses", () => {
    beforeEach(async () => {
        await prisma.course.deleteMany();
        await prisma.user.deleteMany();
    });

    it("should return an empty array when no courses exist", async () => {
        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("should return a list of courses", async () => {
        const courses = await createCourses(2);

        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);

        const [course1, course2] = response.body;
        expect(course1.title).toBe(courses[0].title);
        expect(course2.title).toBe(courses[1].title);
    });
});
