import request from "supertest";
import app from "../src/app";
import { createContext } from "./context";
import { createInstructor } from "./utils";

const prisma = createContext().prisma;

describe("POST /user/signin", () => {
    beforeEach(async () => {
        await prisma.course.deleteMany();
        await prisma.user.deleteMany();
    });

    it("should create a new user if one doesn't exist", async () => {
        const student = {
            email: "test@gmail.com",
            name: "Tester",
            image: "https://image.com/test.png",
            role: "STUDENT",
        };

        const response = await request(app).post("/user/signin").send(student);

        expect(response.status).toBe(200);

        const student1 = response.body;
        expect(student1.email).toBe(student.email);
    });

    it("should return an existing user if already registered", async () => {
        const existingInstructor = await createInstructor();

        const response = await request(app)
            .post("/user/signin")
            .send(existingInstructor);

        expect(response.status).toBe(200);

        const instructor1 = response.body;
        expect(instructor1.email).toBe(existingInstructor.email);

        const instructorInDb = await prisma.user.findMany({
            where: { email: existingInstructor.email },
        });

        expect(instructorInDb).toHaveLength(1);
    });
});
