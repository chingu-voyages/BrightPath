import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Home from "@/app/page";

describe("Home", () => {
    it("renders without crashing", () => {
        expect(() => render(<Home />)).not.toThrow();
    });
});
