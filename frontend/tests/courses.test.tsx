import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { expect, describe, it } from "@jest/globals";
import Courses from "@/app/courses/page";

import { courses } from "./mocks/data.json";

describe("Courses", () => {
    it("renders without crashing", async () => {
        const Page = await Courses();
        expect(() => render(Page)).not.toThrow();
    });

    it("renders the correct number of courses", async () => {
        const Page = await Courses();
        expect(render(Page).getAllByTestId("course")).toHaveLength(
            courses.length,
        );
    });
});
