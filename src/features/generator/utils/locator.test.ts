import {
    describe,
    expect,
    it,
} from "vitest";

import { locatorStrategy } from "./locator";

describe("locatorStrategy", () => {
    it("converts id", () => {
        expect(
            locatorStrategy("id"),
        ).toBe("AppiumBy.ID");
    });

    it("converts xpath", () => {
        expect(
            locatorStrategy("xpath"),
        ).toBe("AppiumBy.XPATH");
    });

    it("converts accessibilityId", () => {
        expect(
            locatorStrategy(
                "accessibilityId",
            ),
        ).toBe(
            "AppiumBy.ACCESSIBILITYID",
        );
    });
});