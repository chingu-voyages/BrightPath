import request from "supertest";
import app from "../src/app";
import { createContext } from "../src/context";
import { Role, Difficulty } from "@prisma/client";

const prisma = createContext().prisma;

describe("GET /courses", () => {
    // Clean up after each test
    afterEach(async () => {
        await prisma.course.deleteMany();
        await prisma.user.deleteMany();
    });

    it("should return an empty array when no courses exist", async () => {
        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("should return a list of courses", async () => {
        // create instructor
        const instructor = await prisma.user.create({
            data: {
                name: "Instructor 1",
                email: "some@email.com",
                role: Role.INSTRUCTOR,
            },
        });

        // create courses
        await prisma.course.createMany({
            data: [
                {
                    title: "Course 1",
                    slug: "course-1",
                    shortDescription: "Short description 1",
                    description: "Description 1",
                    duration: "2h",
                    difficulty: Difficulty.BEGINNER,
                    thumbnail: "thumbnail1.png",
                    published: true,
                    instructorId: instructor.id
                },
                {
                    title: "Course 2",
                    slug: "course-2",
                    shortDescription: "Short description 2",
                    description: "Description 2",
                    duration: "3h",
                    difficulty: Difficulty.INTERMEDIATE,
                    thumbnail: "thumbnail2.png",
                    published: true,
                    instructorId: instructor.id
                },
            ],
        });

        const response = await request(app).get("/courses");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);

        const [course1, course2] = response.body;
        expect(course1.title).toBe("Course 1");
        expect(course2.title).toBe("Course 2");
    });
});

