import {
    describe,
    expect,
    it,
} from "vitest";

import { elementExistsEmitter } from "./ElementExistsEmitter";

import type {
    ElementExistsNodeData,
    FlowNode,
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
        ElementExistsNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "elementExists",
): FlowNode & {
    data: ElementExistsNodeData;
} {
    return {
        id: "element-exists-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "elementExists",

            title: "Element Exists",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: ElementExistsNodeData;
    };
}

describe(
    "ElementExistsEmitter",
    () => {
        it(
            "generates element_exists() with set_variable()",
            () => {
                const code =
                    elementExistsEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementExists",
    element_exists(
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
                    elementExistsEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "loginExists",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "loginExists",
    element_exists(
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
                    elementExistsEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonExists",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonExists",
    element_exists(
        AppiumBy.XPATH,
        "//XCUIElementTypeButton[@name=\\\"Login\\\"]",
    ),
)`,
                );
            },
        );

        it(
            "supports custom variable names",
            () => {
                const code =
                    elementExistsEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitButtonExists",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitButtonExists",
    element_exists(
        AppiumBy.ID,
        "submit_button",
    ),
)`,
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    elementExistsEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "elementExists",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementExists",
    element_exists(
        AppiumBy.ID,
        "login \\"button\\"",
    ),
)`,
                );
            },
        );

        it(
            "escapes special characters in variable name",
            () => {
                const code =
                    elementExistsEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'element "exists"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "element \\"exists\\"",
    element_exists(
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
                    elementExistsEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "elementExists",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementExists",
    element_exists(
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
                    elementExistsEmitter.emit(
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
    element_exists(
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
                    elementExistsEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "elementExists",',
                );

                expect(lines[2]).toBe(
                    "    element_exists(",
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
                    elementExistsEmitter.emit(
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
    },
);