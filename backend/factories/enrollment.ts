import { Prisma, Role, EnrollmentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { courseFactory } from "./course";
import { userFactory } from "./user";

type Enrollment = Prisma.EnrollmentGetPayload<{
    include: { course: true; user: true };
}>;

export const enrollmentFactory = (
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE,
    userId: string | undefined = undefined,
): Enrollment => {
    let student;
    const course = courseFactory();

    if (userId === undefined) {
        student = userFactory(Role.STUDENT);
    } else {
        student = userFactory(Role.STUDENT, userId);
    }

    return {
        id: faker.number.int(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        status: status,
        progress: faker.number.float({ min: 0, max: 1 }),
        granularProgress: {}, // unit ids as keys, with lesson ids, and progress as values
        courseId: course.id,
        course: course,
        userId: student.id,
        user: student,
    };
};
