// courseController.test.ts
import { getAllCourses } from '../src/courseController';
import { MockContext, Context, createMockContext } from '../src/context'

import { Difficulty } from "@prisma/client";

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})


describe('getAllCourses', () => {
  test('should fetch all courses', async () => {
    const courses = [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        title: 'Course 1',
        slug: 'course-1',
        shortDescription: 'Short description for Course 1',
        description: 'Description for Course 1',
        duration: '1 hour',
        difficulty: Difficulty.BEGINNER,
        thumbnail: 'url-to-thumbnail',
        assignmentId: null,
        instructorId: 1,
      },
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false,
        title: 'Course 2',
        slug: 'course-2',
        shortDescription: 'Short description for Course 2',
        description: 'Description for Course 2',
        duration: '2 hours',
        difficulty: Difficulty.INTERMEDIATE,
        thumbnail: 'url-to-thumbnail',
        assignmentId: null,
        instructorId: 2,
      },
    ];

    mockCtx.prisma.course.findMany.mockResolvedValue(courses);

    await expect(getAllCourses(ctx)).resolves.toEqual(courses);
  });

  test('should return an empty array when no courses are found', async () => {
    mockCtx.prisma.course.findMany.mockResolvedValue([]);

    await expect(getAllCourses(ctx)).resolves.toEqual([]);
  });

  test('should handle errors', async () => {
    const errorMessage = 'Failed to fetch courses';
    mockCtx.prisma.course.findMany.mockRejectedValue(new Error(errorMessage));

    await expect(getAllCourses(ctx)).rejects.toThrow(errorMessage);
  });
});
