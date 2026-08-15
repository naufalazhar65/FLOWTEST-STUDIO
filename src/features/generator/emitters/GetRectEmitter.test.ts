import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getRectEmitter,
} from "./GetRectEmitter";

import type {
    FlowNode,
    GetRectNodeData,
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
        GetRectNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "rect",
): FlowNode & {
    data: GetRectNodeData;
} {
    return {
        id: "get-rect-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getRect",

            title: "Get Rect",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetRectNodeData;
    };
}

describe(
    "GetRectEmitter",
    () => {
        it(
            "generates get_rect() with set_variable()",
            () => {
                const code =
                    getRectEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "rect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "elementRect",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementRect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonRect",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonRect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitRect",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitRect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "rect",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "rect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'element"Rect',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "element\\"Rect",
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "rect",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "rect",
    get_rect(
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
                    getRectEmitter.emit(
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
    get_rect(
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
                    getRectEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "rect",',
                );

                expect(lines[2]).toBe(
                    "    get_rect(",
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
                    getRectEmitter.emit(
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
                    getRectEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getRectEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "rect",
    get_rect(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);