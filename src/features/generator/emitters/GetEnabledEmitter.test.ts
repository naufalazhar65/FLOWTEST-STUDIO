import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getEnabledEmitter,
} from "./GetEnabledEmitter";

import type {
    FlowNode,
    GetEnabledNodeData,
} from "../../flow/types/flowNode";

import type {
    GeneratorContext,
} from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(
    locatorStrategy:
        GetEnabledNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "isEnabled",
): FlowNode & {
    data: GetEnabledNodeData;
} {
    return {
        id: "get-enabled-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getEnabled",

            title: "Get Enabled",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetEnabledNodeData;
    };
}

describe(
    "GetEnabledEmitter",
    () => {
        it(
            "generates get_enabled() with set_variable()",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isEnabled",
    get_enabled(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "loginEnabled",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "loginEnabled",
    get_enabled(
        AppiumBy.ACCESSIBILITY_ID,
        "Login Button",
    ),
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonEnabled",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonEnabled",
    get_enabled(
        AppiumBy.XPATH,
        "//XCUIElementTypeButton[@name=\\"Login\\"]",
    ),
)`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitEnabled",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitEnabled",
    get_enabled(
        AppiumBy.ID,
        "submit_button",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in locator",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "isEnabled",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isEnabled",
    get_enabled(
        AppiumBy.ID,
        "login \\"button\\"",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'is"Enabled',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "is\\"Enabled",
    get_enabled(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );

        it(
            "supports an empty locator",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "isEnabled",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isEnabled",
    get_enabled(
        AppiumBy.ID,
        "",
    ),
)`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "",
    get_enabled(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );

        it(
            "keeps getter indentation nested inside set_variable",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "isEnabled",',
                );

                expect(lines[2]).toBe(
                    "    get_enabled(",
                );

                expect(lines[3]).toBe(
                    "        AppiumBy.ID,",
                );

                expect(lines[4]).toBe(
                    '        "login_button",',
                );

                expect(lines[5]).toBe(
                    "    ),",
                );

                expect(lines[6]).toBe(
                    ")",
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getEnabledEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).not.toContain(
                    "True",
                );

                expect(code).not.toContain(
                    "False",
                );

                expect(code).not.toContain(
                    "None",
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getEnabledEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getEnabledEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "isEnabled",
    get_enabled(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);