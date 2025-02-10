import { Prisma, AssignmentType } from "@prisma/client";
import { faker } from "@faker-js/faker";

type Assignment = Prisma.AssignmentGetPayload<{}>;

type ReadingAssignment = Prisma.AssignmentGetPayload<{
    include: { ReadingAssignment: true };
}>;

type VideoAssignment = Prisma.AssignmentGetPayload<{
    include: { VideoAssignment: true };
}>;

type QuizAssignment = Prisma.AssignmentGetPayload<{
    include: { QuizAssignment: true };
}>;

export const readingAssignmentFactory = (
    unitId = faker.number.int(),
): ReadingAssignment => {
    const id = faker.number.int();
    return {
        id: id,
        ...assignmentCreateInputWithoutUnitFactory(AssignmentType.READING),
        ReadingAssignment: {
            id: faker.number.int(),
            assignmentId: id,
            ...readingAssignmentCreateInputFactory(),
        },
        unitId: unitId,
    };
};

export const videoAssignmentFactory = (
    unitId = faker.number.int(),
): VideoAssignment => {
    const id = faker.number.int();
    return {
        id: id,
        ...assignmentCreateInputWithoutUnitFactory(AssignmentType.VIDEO),
        VideoAssignment: {
            id: faker.number.int(),
            assignmentId: id,
            ...videoAssignmentCreateInputFactory(),
        },
        unitId: unitId,
    };
};

export const assignmentFactory = (
    lessonId = faker.number.int(),
    type = AssignmentType.READING,
): Assignment => {
    if (type === AssignmentType.READING) {
        return readingAssignmentFactory(lessonId);
    }

    if (type === AssignmentType.VIDEO) {
        return videoAssignmentFactory(lessonId);
    }

    return {
        id: faker.number.int(),
        ...assignmentCreateInputWithoutUnitFactory(),
        unitId: lessonId,
    };
};

export const assignmentCreateInputFactory = (
    lessonId: number,
): Prisma.AssignmentCreateInput => {
    return {
        ...assignmentCreateInputWithoutUnitFactory(),
        unit: {
            connect: { id: lessonId },
        },
    };
};

export const assignmentCreateInputWithoutUnitFactory = (
    type: AssignmentType = AssignmentType.READING,
) => {
    const title = faker.word.noun(4);

    return {
        title: title,
        type: type,
        duration: getRandomTimeInMs(),
    };
};

export const readingAssignmentCreateInputFactory = () => {
    return {
        content: generateFakeHTML(),
    };
};

export const videoAssignmentCreateInputFactory = () => {
    return {
        videoUrl: faker.internet.url(),
        transcript: faker.lorem.paragraph(),
    };
};

export const timedAssesmentAssignmentCreateInputFactory = () => {
    return {
        ...quizAssignmentCreateInputFactory(),
        timeLimit: 1000 * 60 * 30, // 30 minutes in ms
    };
};

export const quizAssignmentCreateInputFactory = () => {
    return {
        questions: generateFakeQuizQuestionsArray(),
    };
};

export const interactiveAssignmentCreateInputFactory = () => {
    const language = faker.helpers.arrayElement([
        "javascript",
        "python",
        "java",
        "cpp",
    ]);
    return {
        codeSnippet: generateFakeCodeSnippet(language),
        language,
        testCases: generateFakeTestCases(language),
        maxAttempts: faker.number.int({ min: 1, max: 5 }),
        constraints: generateFakeConstraints(),
        instructions: `Implement a function that adds two numbers together. The function should take two parameters and return their sum.`,
    };
};

const generateFakeCodeSnippet = (language: string) => {
    const examples: Record<string, string> = {
        javascript: `function add(a, b) {\n  return a + b;\n}`,
        python: `def add(a, b):\n    return a + b`,
        java: `public class Solution {\n  public static int add(int a, int b) {\n    return a + b;\n  }\n}`,
        cpp: `int add(int a, int b) {\n  return a + b;\n}`,
    };
    return examples[language] || examples.javascript;
};

const generateFakeTestCases = (language: string) => {
    return [
        { input: "(2, 3)", expectedOutput: "5" },
        { input: "(10, 15)", expectedOutput: "25" },
        { input: "(-5, 5)", expectedOutput: "0" },
    ].map((tc) => ({
        input:
            language === "python"
                ? tc.input.replace("(", "").replace(")", "")
                : tc.input,
        expectedOutput: tc.expectedOutput,
    }));
};

const generateFakeConstraints = () => {
    return faker.helpers.arrayElements(
        [
            "Must use recursion",
            "Execution time must be below 100ms",
            "Function must have O(n) complexity",
        ],
        faker.number.int({ min: 1, max: 3 }),
    );
};

const generateFakeQuizQuestionsArray = () => {
    const questions = [] as {
        question: string;
        options: string[];
        answer: number;
    }[];

    for (let i = 0; i < 5; i++) {
        const question = faker.lorem.sentence();
        const options = [] as string[];
        for (let j = 0; j < 4; j++) {
            options.push(faker.lorem.word());
        }
        const answer = faker.number.int({ min: 0, max: 3 });
        questions.push({ question, options, answer });
    }

    return questions;
};

const getRandomTimeInMs = (): number => {
    const minMs = 60_000; // 1 minute in ms
    const maxMs = 7_200_000; // 2 hours in ms
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

const generateFakeHTML = () => {
    return `
    <div>
      <h1>${faker.lorem.sentence()}</h1>
      <p>${faker.lorem.paragraphs(3, "</p><p>")}</p>
      <img src="${faker.image.url()}" alt="Random Image">
      <ul>
        <li>${faker.lorem.words(3)}</li>
        <li>${faker.lorem.words(3)}</li>
        <li>${faker.lorem.words(3)}</li>
      </ul>
    </div>
  `;
};
