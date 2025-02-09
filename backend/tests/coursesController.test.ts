import { getAllCourses, getCourseBySlug } from "../src/courseController";
import { MockContext, Context, createMockContext } from "./context";
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

describe("getCourseBySlug", () => {
    test("should fetch a course by slug", async () => {
        const courses = await createCourses(1);
        const course = courses[0];

        mockCtx.prisma.course.findUnique.mockResolvedValue(course);

        await expect(getCourseBySlug(ctx, "sample-course")).resolves.toEqual(
            course,
        );
    });

    test("should fetch a course with all its units", async () => {
        const courses = await createCourses(1);
        const course = courses[0];

        mockCtx.prisma.course.findUnique.mockResolvedValue(course);

        await expect(getCourseBySlug(ctx, "sample-course")).resolves.toEqual(
            course,
        );
        expect(mockCtx.prisma.course.findUnique).toHaveBeenCalledWith({
            where: { slug: "sample-course" },
            include: {
                instructor: true,
                units: {
                    include: {
                        assignments: {
                            include: {
                                ReadingAssignment: true,
                                VideoAssignment: true,
                                InteractiveAssignment: true,
                                QuizAssignment: true,
                            },
                        },
                    },
                },
            },
        });
    });

    test("should return null if no course is found with the given slug", async () => {
        mockCtx.prisma.course.findUnique.mockResolvedValue(null);

        await expect(
            getCourseBySlug(ctx, "nonexistent-slug"),
        ).resolves.toBeNull();
    });

    test("should handle errors", async () => {
        const errorMessage = "Failed to fetch course";
        mockCtx.prisma.course.findUnique.mockRejectedValue(
            new Error(errorMessage),
        );

        await expect(getCourseBySlug(ctx, "error-slug")).rejects.toThrow(
            errorMessage,
        );
    });
});
