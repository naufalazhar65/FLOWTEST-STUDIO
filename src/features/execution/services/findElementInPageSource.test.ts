import {
    describe,
    expect,
    it,
} from "vitest";

import type {
    ElementInfo,
} from "../../inspector/types/ElementInfo";

import {
    findElementInPageSource,
} from "./findElementInPageSource";

describe(
    "findElementInPageSource",
    () => {
        const elements: ElementInfo[] = [
            {
                id: "root",
                tagName:
                    "Application",
                children: [
                    {
                        id:
                            "login",
                        tagName:
                            "Button",
                        text:
                            "Login",
                        children:
                            [],
                    },
                    {
                        id:
                            "container",
                        tagName:
                            "Other",
                        children: [
                            {
                                id:
                                    "username",
                                tagName:
                                    "TextField",
                                contentDescription:
                                    "Username",
                                children:
                                    [],
                            },
                        ],
                    },
                ],
            },
        ];

        it(
            "finds an element by semantic text",
            () => {
                const result =
                    findElementInPageSource(
                        elements,
                        "Login",
                    );

                expect(
                    result?.id,
                ).toBe(
                    "login",
                );
            },
        );

        it(
            "finds a nested element recursively",
            () => {
                const result =
                    findElementInPageSource(
                        elements,
                        "Username",
                    );

                expect(
                    result?.id,
                ).toBe(
                    "username",
                );
            },
        );

        it(
            "returns null when the target does not exist",
            () => {
                const result =
                    findElementInPageSource(
                        elements,
                        "Dashboard",
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);