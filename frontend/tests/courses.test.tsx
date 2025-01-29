import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Courses from "@/app/courses/page";

import { courses } from "./mocks/data.json";

describe("Courses", () => {
    it("renders without crashing", async () => {
        const Page = await Courses();
        expect(() => render(Page)).not.toThrow();
    });

    it("renders the correct number of courses", async () => {
        const Page = await Courses();
        const courseElements = render(Page).getAllByRole("link");

        expect(courseElements).toHaveLength(courses.length);
    });
});
