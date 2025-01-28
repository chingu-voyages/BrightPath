import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Course from "@/app/courses/[slug]/page";

import { courses } from "./mocks/data.json";

// this tests the course enrollment flow
describe("Course Enrollment", () => {
    it("should render the enroll button", async () => {
        const Page = await Course({ params: { slug: courses[0].slug } });

        expect(render(Page).getByText("Enroll")).toBeTruthy();
    });

    it("should render the course enrollment success message", () => {});
});
