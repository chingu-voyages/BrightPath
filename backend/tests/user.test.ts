import request from "supertest";
import app from "../src/app";
import { createContext } from "./context";
import { cleanDatabase, createPersistentInstructor } from "./utils";

const ctx = createContext();
const prisma = ctx.prisma;

describe("users can signup, and signin", () => {
    beforeEach(async () => {
        await cleanDatabase(ctx);
    });

    it("should create a new user if one doesn't exist", async () => {
        const student = {
            email: "test@gmail.com",
            name: "Tester",
            image: "https://image.com/test.png",
            role: "STUDENT",
        };

        const response = await request(app).post("/user/signup").send(student);

        expect(response.status).toBe(200);

        const student1 = response.body;
        expect(student1.email).toBe(student.email);
    });

    it("should return an existing user if already registered", async () => {
        const existingInstructor = (await createPersistentInstructor(ctx))[0];

        const response = await request(app).get(
            "/user/?email=" + existingInstructor.email,
        );

        expect(response.status).toBe(200);

        const instructor1 = response.body;
        expect(instructor1.email).toBe(existingInstructor.email);

        const instructorInDb = await prisma.user.findMany({
            where: { email: existingInstructor.email },
        });

        expect(instructorInDb).toHaveLength(1);
    });
});
