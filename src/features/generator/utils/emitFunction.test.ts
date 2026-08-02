import {
    describe,
    expect,
    it,
} from "vitest";

import { emitFunction } from "./emitFunction";

describe("emitFunction", () => {
    it("generates python function call", () => {
        const code = emitFunction(
            "tap",
            [
                "AppiumBy.ID",
                '"login_button"',
            ],
        );

        expect(code).toBe(
`tap(
    AppiumBy.ID,
    "login_button",
)`
        );
    });

    it("supports multiple arguments", () => {
        const code = emitFunction(
            "input",
            [
                "AppiumBy.ID",
                '"username"',
                '"admin"',
            ],
        );

        expect(code).toContain(
            '"admin"',
        );
    });
});