import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getTextEmitter,
} from "./GetTextEmitter";

import type {
    FlowNode,
    GetTextNodeData,
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
        GetTextNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "text",
): FlowNode & {
    data: GetTextNodeData;
} {
    return {
        id: "get-text-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getText",

            title: "Get Text",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetTextNodeData;
    };
}

describe(
    "GetTextEmitter",
    () => {
        it(
            "generates get_text() with set_variable()",
            () => {
                const code =
                    getTextEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "text",
    get_text(
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
                    getTextEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "buttonText",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonText",
    get_text(
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
                    getTextEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeStaticText[@name="Welcome"]',
                            "welcomeText",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "welcomeText",
    get_text(
        AppiumBy.XPATH,
        "//XCUIElementTypeStaticText[@name=\\"Welcome\\"]",
    ),
)`,
                );
            },
        );

        it(
            "supports different variable names",
            () => {
                const code =
                    getTextEmitter.emit(
                        createNode(
                            "id",
                            "username",
                            "usernameText",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameText",
    get_text(
        AppiumBy.ID,
        "username",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in locator",
            () => {
                const code =
                    getTextEmitter.emit(
                        createNode(
                            "id",
                            'user "name"',
                            "usernameText",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameText",
    get_text(
        AppiumBy.ID,
        "user \\"name\\"",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getTextEmitter.emit(
                        createNode(
                            "id",
                            "username",
                            'user"text',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "user\\"text",
    get_text(
        AppiumBy.ID,
        "username",
    ),
)`,
                );
            },
        );

        it(
            "supports empty locator",
            () => {
                const code =
                    getTextEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "text",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "text",
    get_text(
        AppiumBy.ID,
        "",
    ),
)`,
                );
            },
        );

        it(
            "supports empty variable name",
            () => {
                const code =
                    getTextEmitter.emit(
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
    get_text(
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
                    getTextEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "text",',
                );

                expect(lines[2]).toBe(
                    "    get_text(",
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
                    getTextEmitter.emit(
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
                    getTextEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getTextEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "text",
    get_text(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);