import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";

const server = setupServer(...handlers);

global.matchMedia = global.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    }
}

beforeAll(() => server.listen());
afterEach(() => {
    cleanup();
    server.resetHandlers();
});
afterAll(() => server.close());
