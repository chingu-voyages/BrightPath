import { Context } from "./context";
import { AssignmentType, Difficulty, Role } from "@prisma/client";
import { userFactory, userCreateInputFactory } from "../factories/user";
import {
    courseFactory,
    courseCreateInputWithoutInstructorFactory,
} from "../factories/course";
import { unitCreateInputWithoutCourseFactory } from "../factories/unit";
import {
    assignmentCreateInputWithoutUnitFactory,
    interactiveAssignmentCreateInputFactory,
    quizAssignmentCreateInputFactory,
    readingAssignmentCreateInputFactory,
    timedAssesmentAssignmentCreateInputFactory,
    videoAssignmentCreateInputFactory,
} from "../factories/assignment";
import { tagCreateInputFactory } from "../factories/tag";

const difficultyValues = Object.values(Difficulty);

export const cleanDatabase = async (ctx: Context) => {
    const deleteCertificates = ctx.prisma.certificate.deleteMany();
    const deleteEnrollments = ctx.prisma.enrollment.deleteMany();
    const deleteQuizzes = ctx.prisma.quizAssignment.deleteMany();
    const deleteInteractiveAssignments =
        ctx.prisma.interactiveAssignment.deleteMany();
    const deleteVideoAssignments = ctx.prisma.videoAssignment.deleteMany();
    const deleteReadingAssignments = ctx.prisma.readingAssignment.deleteMany();
    const deleteAssignments = ctx.prisma.assignment.deleteMany();
    const deleteTags = ctx.prisma.tag.deleteMany();
    const deleteCourseTags = ctx.prisma.courseTag.deleteMany();
    const deleteUnits = ctx.prisma.unit.deleteMany();
    const deleteCourses = ctx.prisma.course.deleteMany();
    const deleteAccounts = ctx.prisma.account.deleteMany();
    const deleteUsers = ctx.prisma.user.deleteMany();

    await ctx.prisma.$transaction([
        deleteCertificates,
        deleteEnrollments,
        deleteQuizzes,
        deleteInteractiveAssignments,
        deleteVideoAssignments,
        deleteReadingAssignments,
        deleteAssignments,
        deleteCourseTags,
        deleteTags,
        deleteUnits,
        deleteCourses,
        deleteAccounts,
        deleteUsers,
    ]);
};

export const createPersistentCourse = async (
    ctx: Context,
    amount: number = 1,
) => {
    const instructors = await ctx.prisma.user.createManyAndReturn({
        data: Array.from({ length: 3 }, () => {
            return userCreateInputFactory(Role.INSTRUCTOR);
        }),
    });

    const instructor =
        instructors[Math.floor(Math.random() * instructors.length)];

    const tags = await ctx.prisma.tag.createManyAndReturn({
        data: Array.from({ length: 5 }, () => {
            return tagCreateInputFactory();
        }),
    });

    const courses = await ctx.prisma.course.createManyAndReturn({
        data: Array.from({ length: amount }, () => {
            const randomDifficulty = difficultyValues[Math.floor(Math.random() * difficultyValues.length)];
            return {
                ...courseCreateInputWithoutInstructorFactory(randomDifficulty),
                instructorId: instructor.id,

            };
        }),
        include: {
            instructor: true,
        },
        skipDuplicates: true,
    });

    const assignmentTypes = Object.values(AssignmentType).filter(
        (type) => type !== AssignmentType.TIMED_ASSESSMENT,
    );

    for (let course of courses) {
        course = await ctx.prisma.course.update({
            where: {
                id: course.id,
            },
            data: {
                tags: {
                    create: tags.map((tag) => {
                        return {
                            tagId: tag.id,
                        }
                    }),
                },
            },
            include: {
                tags: true,
                instructor: true,
            },
        });
        
        const units = await ctx.prisma.unit.createManyAndReturn({
            data: Array.from(
                { length: Math.floor(Math.random() * 10) + 1 },
                () => {
                    return {
                        ...unitCreateInputWithoutCourseFactory(),
                        courseId: course.id,
                    };
                },
            ),
        });

        for (const unit of units) {
            const assignments = await ctx.prisma.assignment.createManyAndReturn(
                {
                    data: assignmentTypes.map((type) => {
                        return {
                            ...assignmentCreateInputWithoutUnitFactory(type),
                            unitId: unit.id,
                        };
                    }),
                },
            );

            for (const assignment of assignments) {
                if (assignment.type === AssignmentType.READING) {
                    await ctx.prisma.readingAssignment.create({
                        data: {
                            assignmentId: assignment.id,
                            ...readingAssignmentCreateInputFactory(),
                        },
                    });
                }

                if (assignment.type === AssignmentType.VIDEO) {
                    await ctx.prisma.videoAssignment.create({
                        data: {
                            assignmentId: assignment.id,
                            ...videoAssignmentCreateInputFactory(),
                        },
                    });
                }

                if (assignment.type === AssignmentType.INTERACTIVE) {
                    await ctx.prisma.interactiveAssignment.create({
                        data: {
                            assignmentId: assignment.id,
                            ...interactiveAssignmentCreateInputFactory(),
                        },
                    });
                }

                if (assignment.type === AssignmentType.QUIZ) {
                    await ctx.prisma.quizAssignment.create({
                        data: {
                            assignmentId: assignment.id,
                            ...quizAssignmentCreateInputFactory(),
                        },
                    });
                }

                if (assignment.type === AssignmentType.TIMED_ASSESSMENT) {
                    await ctx.prisma.quizAssignment.create({
                        data: {
                            assignmentId: assignment.id,
                            ...timedAssesmentAssignmentCreateInputFactory(),
                        },
                    });
                }
            }
        }
    }

    return courses;
};

export const createPersistentStudent = async (
    ctx: Context,
    amount: number = 1,
) => {
    return await ctx.prisma.user.createManyAndReturn({
        data: Array.from({ length: amount }, () => {
            return userCreateInputFactory(Role.STUDENT);
        }),
    });
};

export const createPersistentInstructor = async (
    ctx: Context,
    amount: number = 1,
) => {
    return await ctx.prisma.user.createManyAndReturn({
        data: Array.from({ length: amount }, () => {
            return userCreateInputFactory(Role.INSTRUCTOR);
        }),
    });
};

export const createInstructor = async () => {
    return userFactory(Role.INSTRUCTOR);
};

export const createStudent = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return userFactory(Role.STUDENT);
    });
};

export const createCourses = async (amount: number = 1) => {
    return Array.from({ length: amount }, () => {
        return courseFactory();
    });
};
