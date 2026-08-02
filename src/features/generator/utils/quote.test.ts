import {
    describe,
    expect,
    it,
} from "vitest";

import { quote } from "./quote";

describe("quote", () => {
    it("wraps string", () => {
        expect(
            quote("hello"),
        ).toBe('"hello"');
    });

    it("escapes quotes", () => {
        expect(
            quote('hello "world"'),
        ).toBe(
            '"hello \\"world\\""',
        );
    });
});