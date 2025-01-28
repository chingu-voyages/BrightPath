import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from "@testing-library/react";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
    cleanup();
    server.resetHandlers()
});
afterAll(() => server.close());
