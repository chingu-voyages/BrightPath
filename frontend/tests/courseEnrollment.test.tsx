import { render } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";
import Course from "@/app/courses/[slug]/page";

import { courses } from "./mocks/data.json";

// Mock next-auth module
vi.mock("@/auth", () => ({
    handlers: {},
    auth: vi.fn(() =>
        Promise.resolve({
            user: {
                id: "string",
                name: "Test User",
                email: "test@example.com",
            },
            expires: "9999-12-31T23:59:59.999Z",
        }),
    ),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(() => ({
        data: {
            user: {
                id: "string",
                name: "Test User",
                email: "test@example.com",
            },
            expires: "9999-12-31T23:59:59.999Z",
        },
        status: "authenticated",
    })),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

// this tests the course enrollment flow
describe("Course Enrollment", () => {
    it("should render the enroll button", async () => {
        const Page = await Course({ params: { slug: courses[0].slug } });

        expect(render(Page).getByText("Start learning!")).toBeTruthy();
    });

    it("should render the course enrollment success message", () => {});
});
