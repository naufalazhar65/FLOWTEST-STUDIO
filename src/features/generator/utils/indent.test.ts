import {
    describe,
    expect,
    it,
} from "vitest";

import { indent } from "./indent";

describe("indent", () => {
    it("adds indentation", () => {
        expect(
            indent(
                `tap()
input()`
            ),
        ).toBe(
            `    tap()
    input()`
        );
    });

    it("keeps empty lines", () => {
        expect(
            indent(
                `tap()

input()`
            ),
        ).toBe(
            `    tap()

    input()`
        );
    });
});