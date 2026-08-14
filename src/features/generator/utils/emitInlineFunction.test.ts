import {
    describe,
    expect,
    it,
} from "vitest";

import { emitInlineFunction } from "./emitInlineFunction";

describe("emitInlineFunction", () => {
    it("generates inline function", () => {
        expect(
            emitInlineFunction(
                "resolve_variables",
                ['"${status}"'],
            ),
        ).toBe(
            'resolve_variables("${status}")',
        );
    });

    it("generates multiple arguments", () => {
        expect(
            emitInlineFunction(
                "compare",
                [
                    'resolve_variables("${status}")',
                    'resolve_variables("success")',
                    '"equals"',
                ],
            ),
        ).toBe(
            'compare(resolve_variables("${status}"), resolve_variables("success"), "equals")',
        );
    });
});