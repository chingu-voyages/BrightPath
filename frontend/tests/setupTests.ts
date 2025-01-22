import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import "whatwg-fetch";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
