import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getSizeEmitter,
} from "./GetSizeEmitter";

import type {
    FlowNode,
    GetSizeNodeData,
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
        GetSizeNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "size",
): FlowNode & {
    data: GetSizeNodeData;
} {
    return {
        id: "get-size-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getSize",

            title: "Get Size",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetSizeNodeData;
    };
}

describe(
    "GetSizeEmitter",
    () => {
        it(
            "generates get_size() with set_variable()",
            () => {
                const code =
                    getSizeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "size",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "elementSize",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementSize",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonSize",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonSize",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitSize",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitSize",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "size",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "size",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'element"Size',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "element\\"Size",
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "size",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "size",
    get_size(
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
                    getSizeEmitter.emit(
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
    get_size(
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
                    getSizeEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "size",',
                );

                expect(lines[2]).toBe(
                    "    get_size(",
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
                    getSizeEmitter.emit(
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
                    getSizeEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getSizeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "size",
    get_size(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);