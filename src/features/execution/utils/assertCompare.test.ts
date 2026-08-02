import { describe, expect, it } from "vitest";

import { compare } from "./assertCompare";

describe("compare()", () => {
    describe("string operators", () => {
        it.each([
            ["equals", "hello", "hello", true],
            ["equals", "hello", "world", false],

            ["notEquals", "hello", "world", true],
            ["notEquals", "hello", "hello", false],

            ["contains", "hello world", "world", true],
            ["contains", "hello", "abc", false],

            ["notContains", "hello", "abc", true],
            ["notContains", "hello", "ell", false],

            ["startsWith", "hello", "he", true],
            ["startsWith", "hello", "lo", false],

            ["endsWith", "hello", "lo", true],
            ["endsWith", "hello", "he", false],
        ])(
            "%s",
            (
                operator,
                actual,
                expected,
                result,
            ) => {
                expect(
                    compare(
                        actual,
                        expected,
                        operator as never,
                    ),
                ).toBe(result);
            },
        );
    });

    describe("number operators", () => {
        it.each([
            ["greaterThan", "10", "5", true],
            ["greaterThan", "5", "10", false],

            ["greaterThanOrEqual", "10", "10", true],
            ["greaterThanOrEqual", "5", "10", false],

            ["lessThan", "5", "10", true],
            ["lessThan", "10", "5", false],

            ["lessThanOrEqual", "5", "5", true],
            ["lessThanOrEqual", "10", "5", false],
        ])(
            "%s",
            (
                operator,
                actual,
                expected,
                result,
            ) => {
                expect(
                    compare(
                        actual,
                        expected,
                        operator as never,
                    ),
                ).toBe(result);
            },
        );
    });

    describe("boolean operators", () => {
        it("isTrue", () => {
            expect(
                compare(
                    "true",
                    "",
                    "isTrue",
                ),
            ).toBe(true);

            expect(
                compare(
                    "false",
                    "",
                    "isTrue",
                ),
            ).toBe(false);
        });

        it("isFalse", () => {
            expect(
                compare(
                    "false",
                    "",
                    "isFalse",
                ),
            ).toBe(true);

            expect(
                compare(
                    "true",
                    "",
                    "isFalse",
                ),
            ).toBe(false);
        });
    });

    describe("empty operators", () => {
        it("isEmpty", () => {
            expect(
                compare(
                    "",
                    "",
                    "isEmpty",
                ),
            ).toBe(true);

            expect(
                compare(
                    "text",
                    "",
                    "isEmpty",
                ),
            ).toBe(false);
        });

        it("isNotEmpty", () => {
            expect(
                compare(
                    "text",
                    "",
                    "isNotEmpty",
                ),
            ).toBe(true);

            expect(
                compare(
                    "",
                    "",
                    "isNotEmpty",
                ),
            ).toBe(false);
        });
    });

    describe("regex operator", () => {
        it("matches", () => {
            expect(
                compare(
                    "abc123",
                    "^abc\\d+$",
                    "matches",
                ),
            ).toBe(true);

            expect(
                compare(
                    "abcdef",
                    "^abc\\d+$",
                    "matches",
                ),
            ).toBe(false);
        });
    });

    describe("unsupported operator", () => {
        it("throws", () => {
            expect(() =>
                compare(
                    "a",
                    "b",
                    "unknown" as never,
                ),
            ).toThrow(
                "Unsupported assert operator",
            );
        });
    });
});