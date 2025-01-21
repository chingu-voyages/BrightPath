import request from "supertest";
import app from "../src/app";
import { createContext } from "./context";
import { createPersistentCourse } from "./utils";
import { Course } from "@prisma/client";

const ctx = createContext();

describe("GET /courses with no courses", () => {
    it("should return an empty array when no courses exist", async () => {
        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe("GET /courses", () => {
    let courses: Course[];

    beforeEach(async () => {
        await ctx.prisma.course.deleteMany();
        await ctx.prisma.user.deleteMany();

        courses = await createPersistentCourse(ctx, 2);
    });


    it("should return a list of courses", async () => {

        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);

        const [course1, course2] = response.body;
        expect(course1.title).toBe(courses[0].title);
        expect(course2.title).toBe(courses[1].title);
    });
});

describe("GET /courses/:slug", () => {
    beforeEach(async () => {
        await ctx.prisma.course.deleteMany();
        await ctx.prisma.user.deleteMany();
    });

    it("should return a course by slug", async () => {
        const [course] = await createPersistentCourse(ctx, 1);

        const response = await request(app).get(`/courses/${course.slug}`);
        expect(response.status).toBe(200);

        const courseResponse = response.body;
        expect(courseResponse.title).toBe(course.title);
    });

    it("should return 404 if course does not exist", async () => {
        const response = await request(app).get("/courses/nonexistent-slug");
        expect(response.status).toBe(404);
    });
});


