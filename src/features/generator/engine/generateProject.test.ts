import { describe, expect, it, vi } from "vitest";

import { generateProject } from "./generateProject";

import { orderNodes } from "./orderNodes";
import { generatePython } from "./generatePython";

vi.mock("./orderNodes", () => ({
    orderNodes: vi.fn(),
}));

vi.mock("./generatePython", () => ({
    generatePython: vi.fn(),
}));

describe("generateProject", () => {
    it("generates project metadata", () => {
        vi.mocked(orderNodes).mockReturnValue([]);

        vi.mocked(generatePython).mockReturnValue(
            "# generated",
        );

        const project =
            generateProject([], []);

        expect(project.generator).toBe(
            "FlowTest Studio",
        );

        expect(project.framework).toBe(
            "Pytest + Appium",
        );

        expect(
            project.generatedAt,
        ).toBeInstanceOf(Date);
    });

    it("contains expected file paths", () => {
        vi.mocked(orderNodes).mockReturnValue([]);

        vi.mocked(generatePython).mockReturnValue(
            "# generated",
        );

        const project =
            generateProject([], []);

        expect(
            project.files.map(
                (file) => file.path,
            ),
        ).toEqual([
            "tests/test_generated.py",

            "framework/actions.py",

            "framework/driver.py",

            "framework/variables.py",

            "framework/assertions.py",

            "framework/waits.py",

            "README.md",

            "requirements.txt",

            "pytest.ini",
        ]);
    });

    it("generates python test file", () => {
        vi.mocked(orderNodes).mockReturnValue([]);

        vi.mocked(generatePython).mockReturnValue(
            "# generated",
        );

        const project =
            generateProject([], []);

        expect(
            project.files[0].content,
        ).toBe("# generated");
    });

    it("calls orderNodes before generating python", () => {
        vi.mocked(orderNodes).mockReturnValue([]);

        vi.mocked(generatePython).mockReturnValue(
            "# generated",
        );

        generateProject([], []);

        expect(orderNodes).toHaveBeenCalled();

        expect(
            generatePython,
        ).toHaveBeenCalledWith([]);
    });

    it("generates nine files", () => {
        vi.mocked(orderNodes).mockReturnValue([]);

        vi.mocked(generatePython).mockReturnValue(
            "# generated",
        );

        const project =
            generateProject([], []);

        expect(
            project.files,
        ).toHaveLength(9);
    });
});