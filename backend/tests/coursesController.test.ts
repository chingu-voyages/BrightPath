// courseController.test.ts
import { getAllCourses } from "../src/courseController";
import { MockContext, Context, createMockContext } from "../src/context";
import { createCourses } from "./utils";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
});

describe("getAllCourses", () => {
    test("should fetch all courses", async () => {
        const courses = await createCourses(2);

        mockCtx.prisma.course.findMany.mockResolvedValue(courses);

        await expect(getAllCourses(ctx)).resolves.toEqual(courses);
    });

    test("should return an empty array when no courses are found", async () => {
        mockCtx.prisma.course.findMany.mockResolvedValue([]);

        await expect(getAllCourses(ctx)).resolves.toEqual([]);
    });

    test("should handle errors", async () => {
        const errorMessage = "Failed to fetch courses";
        mockCtx.prisma.course.findMany.mockRejectedValue(
            new Error(errorMessage),
        );

        await expect(getAllCourses(ctx)).rejects.toThrow(errorMessage);
    });
});
