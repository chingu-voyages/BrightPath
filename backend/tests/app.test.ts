import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma";

describe("App Endpoints", () => {
    // beforeAll(async () => {
    // Seed test data or use a test database
    // seed users
    // seed courses
    // });

    // afterAll(async () => {
    // Cleanup
    //await prisma.course.deleteMany();
    //await prisma.user.deleteMany();
    // await prisma.$disconnect();
    // });

    it("should return a welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("API is working!");
    });
});
