import {
    describe,
    expect,
    it,
} from "vitest";

import { formatPython } from "./formatPython";

describe("formatPython", () => {
    it("joins sections with blank line", () => {
        expect(
            formatPython([
                "tap()",
                "input()",
            ]),
        ).toBe(
`tap()

input()`
        );
    });

    it("removes empty sections", () => {
        expect(
            formatPython([
                "tap()",
                "",
                "input()",
            ]),
        ).toBe(
`tap()

input()`
        );
    });

    it("returns empty string", () => {
        expect(
            formatPython([]),
        ).toBe("");
    });
});