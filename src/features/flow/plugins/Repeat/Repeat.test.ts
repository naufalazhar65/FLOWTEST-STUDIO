import {
    describe,
    expect,
    it,
} from "vitest";

import {
    repeatPlugin,
} from "./index";

describe("repeatPlugin", () => {
    it("has the correct type", () => {
        expect(
            repeatPlugin.type,
        ).toBe("repeat");
    });

    it("has the correct title", () => {
        expect(
            repeatPlugin.title,
        ).toBe("Repeat");
    });

    it("uses the logic category", () => {
        expect(
            repeatPlugin.category,
        ).toBe("logic");
    });

    it("supports cross-platform execution", () => {
        expect(
            repeatPlugin.supportedPlatforms,
        ).toContain(
            "cross-platform",
        );
    });

    it("has a default repeat count", () => {
        const defaults =
            repeatPlugin.defaults as {
                action: "repeat";
                count: number;
            };

        expect(
            defaults.action,
        ).toBe("repeat");

        expect(
            defaults.count,
        ).toBe(3);
    });

    it("has a count field", () => {
        const countField =
            repeatPlugin.fields.find(
                (field) =>
                    field.key === "count",
            );

        expect(
            countField,
        ).toBeDefined();

        expect(
            countField?.label,
        ).toBe("Count");

        expect(
            countField?.type,
        ).toBe("number");
    });

    it("has body and next output handles", () => {
        expect(
            repeatPlugin.handles?.outputs,
        ).toEqual([
            "body",
            "next",
        ]);
    });

    it("renders preview data correctly", () => {
        expect(
            repeatPlugin.preview,
        ).toBeDefined();

        const element =
            repeatPlugin.preview?.({
                action: "repeat",

                title: "Repeat",

                count: 5,
            } as never);

        expect(
            element,
        ).toBeDefined();
    });
});