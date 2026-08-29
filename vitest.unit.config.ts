import {
    defineConfig,
} from "vitest/config";

export default defineConfig({
    test: {
        globals: true,

        environment: "jsdom",

        environmentOptions: {
            jsdom: {
                url: "http://localhost",
            },
        },

        setupFiles: [
            "./src/test/setup.ts",
        ],

        exclude: [
            "node_modules/**",
            "dist/**",
            "tests/e2e/**",
        ],

        coverage: {
            provider: "v8",
        },
    },
});