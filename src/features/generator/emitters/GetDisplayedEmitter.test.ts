import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getDisplayedEmitter,
} from "./GetDisplayedEmitter";

import type {
    FlowNode,
    GetDisplayedNodeData,
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
        GetDisplayedNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "isDisplayed",
): FlowNode & {
    data: GetDisplayedNodeData;
} {
    return {
        id: "get-displayed-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getDisplayed",

            title: "Get Displayed",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetDisplayedNodeData;
    };
}

describe(
    "GetDisplayedEmitter",
    () => {
        it(
            "generates get_displayed() with set_variable()",
            () => {
                const code =
                    getDisplayedEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "loginDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "loginDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "isDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'is"Displayed',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "is\\"Displayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "isDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isDisplayed",
    get_displayed(
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
                    getDisplayedEmitter.emit(
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
    get_displayed(
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
                    getDisplayedEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "isDisplayed",',
                );

                expect(lines[2]).toBe(
                    "    get_displayed(",
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
                    getDisplayedEmitter.emit(
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
                    getDisplayedEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getDisplayedEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "isDisplayed",
    get_displayed(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);