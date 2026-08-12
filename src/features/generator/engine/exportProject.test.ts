import {
    describe,
    expect,
    it,
} from "vitest";

import {
    exportProject,
} from "./exportProject";

describe("exportProject", () => {
    it("returns project files", () => {
        const files =
            exportProject({
                files: [
                    {
                        path: "test.py",
                        content: "print()",
                    },
                ],

                generatedAt:
                    new Date(),

                generator:
                    "FlowTest Studio",

                framework:
                    "pytest",
            });

        expect(files).toHaveLength(
            1,
        );

        expect(files[0].path).toBe(
            "test.py",
        );
    });
});