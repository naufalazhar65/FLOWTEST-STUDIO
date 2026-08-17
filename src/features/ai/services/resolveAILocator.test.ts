import {
    describe,
    expect,
    it,
} from "vitest";

import {
    resolveAILocator,
} from "./resolveAILocator";

import type {
    ElementInfo,
} from "../../inspector/types/ElementInfo";

function createElements():
    ElementInfo[] {
    return [
        {
            id:
                "username-node",

            tagName:
                "EditText",

            text:
                "",

            label:
                "Username",

            value:
                "",

            name:
                "username",

            contentDescription:
                "username",

            resourceId:
                "com.demo:id/username_input",

            className:
                "android.widget.EditText",

            displayed:
                true,

            enabled:
                true,

            selected:
                false,

            accessible:
                true,

            children: [],
        },

        {
            id:
                "password-node",

            tagName:
                "EditText",

            text:
                "",

            label:
                "Password",

            value:
                "",

            name:
                "password",

            contentDescription:
                "password",

            resourceId:
                "com.demo:id/password_input",

            className:
                "android.widget.EditText",

            displayed:
                true,

            enabled:
                true,

            selected:
                false,

            accessible:
                true,

            children: [],
        },

        {
            id:
                "login-node",

            tagName:
                "Button",

            text:
                "Login",

            label:
                "Login",

            contentDescription:
                "Login",

            resourceId:
                "com.demo:id/login_button",

            className:
                "android.widget.Button",

            displayed:
                true,

            enabled:
                true,

            selected:
                false,

            accessible:
                true,

            children: [],
        },
    ];
}

describe(
    "resolveAILocator",
    () => {
        it(
            "resolves username to the resource id",
            () => {
                const result =
                    resolveAILocator(
                        createElements(),
                        "username",
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                expect(
                    result.matchedElementId,
                ).toBe(
                    "username-node",
                );

                expect(
                    result.selected,
                ).toMatchObject({
                    strategy:
                        "id",

                    value:
                        "com.demo:id/username_input",
                });
            },
        );

        it(
            "resolves login using semantic text",
            () => {
                const result =
                    resolveAILocator(
                        createElements(),
                        "login",
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                expect(
                    result.matchedElementId,
                ).toBe(
                    "login-node",
                );

                expect(
                    result.selected,
                ).not.toBeNull();
            },
        );

        it(
            "returns notFound for an unknown target",
            () => {
                const result =
                    resolveAILocator(
                        createElements(),
                        "remember me",
                    );

                expect(
                    result.status,
                ).toBe(
                    "notFound",
                );

                expect(
                    result.selected,
                ).toBeNull();

                expect(
                    result.candidates,
                ).toHaveLength(
                    0,
                );
            },
        );

        it(
            "detects ambiguous matches",
            () => {
                const elements:
                    ElementInfo[] =
                    [
                        {
                            ...createElements()[0],

                            id:
                                "username-one",

                            resourceId:
                                "com.demo:id/username_one",
                        },

                        {
                            ...createElements()[0],

                            id:
                                "username-two",

                            resourceId:
                                "com.demo:id/username_two",
                        },
                    ];

                const result =
                    resolveAILocator(
                        elements,
                        "username",
                    );

                expect(
                    result.status,
                ).toBe(
                    "ambiguous",
                );

                expect(
                    result.selected,
                ).toBeNull();

                expect(
                    result.candidates.length,
                ).toBeGreaterThan(
                    0,
                );
            },
        );

        it(
            "searches nested elements",
            () => {
                const elements:
                    ElementInfo[] =
                    [
                        {
                            id:
                                "root",

                            tagName:
                                "LinearLayout",

                            children: [
                                {
                                    ...createElements()[0],
                                },
                            ],
                        },
                    ];

                const result =
                    resolveAILocator(
                        elements,
                        "username",
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                expect(
                    result.matchedElementId,
                ).toBe(
                    "username-node",
                );
            },
        );
    },
);