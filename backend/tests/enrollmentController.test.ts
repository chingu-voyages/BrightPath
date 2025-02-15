import { Enrollment, EnrollmentStatus, Prisma } from "@prisma/client";
import { enrollmentFactory } from "../factories/enrollment";
import { MockContext, Context, createMockContext } from "./context";
import {
    getAllEnrollments,
    getEnrollmentsByUserId,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    createGranularProgressObject,
} from "../src/enrollmentController";
import { courseFactory } from "../factories/course";

type Unit = Prisma.UnitGetPayload<{
    include: { assignments: true };
}>;

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
});

describe("getAllEnrollments", () => {
    test("should fetch all enrollments", async () => {
        const enrollments = [enrollmentFactory(), enrollmentFactory()];

        mockCtx.prisma.enrollment.findMany.mockResolvedValue(enrollments);

        await expect(getAllEnrollments(ctx)).resolves.toEqual(enrollments);
    });

    test("should return an empty array when no courses are found", async () => {
        mockCtx.prisma.enrollment.findMany.mockResolvedValue([]);

        await expect(getAllEnrollments(ctx)).resolves.toEqual([]);
    });

    test("should handle errors", async () => {
        const errorMessage = "Failed to fetch enrollments";
        mockCtx.prisma.enrollment.findMany.mockRejectedValue(
            new Error(errorMessage),
        );

        await expect(getAllEnrollments(ctx)).rejects.toThrow(errorMessage);
    });
});

describe("getEnrollmentsByUserId", () => {
    test("should fetch enrollments by user id", async () => {
        const userId = "1";
        const enrollments = [
            enrollmentFactory(undefined, userId),
            enrollmentFactory(undefined, userId),
        ];

        mockCtx.prisma.enrollment.findMany.mockResolvedValue(enrollments);

        expect(await getEnrollmentsByUserId(ctx, userId)).toEqual(enrollments);

        expect(mockCtx.prisma.enrollment.findMany).toHaveBeenCalledWith({
            where: { userId },
            include: {
                course: {
                    include: {
                        instructor: true,
                        units: { include: { assignments: true } },
                    },
                },
            },
        });
    });

    test("should return an empty array when no enrollments are found", async () => {
        const userId = "1";

        mockCtx.prisma.enrollment.findMany.mockResolvedValue([]);

        expect(await getEnrollmentsByUserId(ctx, userId)).toEqual([]);

        expect(mockCtx.prisma.enrollment.findMany).toHaveBeenCalledWith({
            where: { userId },
            include: {
                course: {
                    include: {
                        instructor: true,
                        units: { include: { assignments: true } },
                    },
                },
            },
        });
    });
});

describe("createEnrollment", () => {
    test("should create a new enrollment", async () => {
        const course = courseFactory();
        const newEnrollment = enrollmentFactory(
            undefined,
            undefined,
            course.id,
        );

        mockCtx.prisma.course.findUniqueOrThrow.mockResolvedValue(course);
        mockCtx.prisma.enrollment.create.mockResolvedValue(newEnrollment);

        expect(
            await createEnrollment(
                ctx,
                newEnrollment.courseId,
                newEnrollment.userId,
            ),
        ).toEqual(newEnrollment);
    });

    test("should set default granular progress according to the course", async () => {
        const course = courseFactory();
        const newEnrollment = enrollmentFactory(
            undefined,
            undefined,
            course.id,
        );

        mockCtx.prisma.course.findUniqueOrThrow.mockResolvedValue(course);
        mockCtx.prisma.enrollment.create.mockResolvedValue(newEnrollment);

        const units = course.units as Unit[];

        const granularProgress = createGranularProgressObject(units);
        newEnrollment.granularProgress = granularProgress;

        // needs to be refactored
        expect(
            await createEnrollment(
                ctx,
                newEnrollment.courseId,
                newEnrollment.userId,
            ),
        ).toEqual(newEnrollment);
    });

    test("should handle errors during creation", async () => {
        const errorMessage = "Course not found";
        const newEnrollment = enrollmentFactory();

        mockCtx.prisma.enrollment.create.mockRejectedValue(
            new Error(errorMessage),
        );

        await expect(
            createEnrollment(ctx, newEnrollment.courseId, newEnrollment.userId),
        ).rejects.toThrow(errorMessage);
    });
});

describe("updateEnrollment", () => {
    test("should update an enrollment", async () => {
        const enrollment = enrollmentFactory();
        const updatedEnrollment = {
            ...enrollment,
            status: "COMPLETED",
        } as unknown as Enrollment;

        mockCtx.prisma.enrollment.update.mockResolvedValue(updatedEnrollment);

        expect(
            await updateEnrollment(
                ctx,
                enrollment.id,
                EnrollmentStatus.COMPLETED,
            ),
        ).toEqual(updatedEnrollment);
    });
});

describe("deleteEnrollment", () => {
    test("should delete an enrollment", async () => {
        const enrollment = enrollmentFactory();
        const enrollmentData = { id: enrollment.id } as unknown as Enrollment;

        mockCtx.prisma.enrollment.delete.mockResolvedValue(enrollmentData);

        expect(await deleteEnrollment(ctx, enrollment.id)).toEqual({
            id: enrollment.id,
        });
    });
});
