import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setupTests.ts"],
        env: {
            ...process.env,
            BACKEND_API_URL: "http://localhost:5000",
            NEXT_PUBLIC_BACKEND_API_URL: "http://localhost:5000",
        },
    },
});
