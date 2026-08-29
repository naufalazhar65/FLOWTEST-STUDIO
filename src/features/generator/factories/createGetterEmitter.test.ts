import {
    describe,
    expect,
    it,
} from "vitest";

import { createGetterEmitter } from "./createGetterEmitter";

import type {
    ElementGetterNodeData,
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
        ElementGetterNodeData["locatorStrategy"] =
        "id",
    locator = "username",
    variableName = "value",
): FlowNode & {
    data: ElementGetterNodeData;
} {
    return {
        id: "getter-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getText",

            title: "Getter",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: ElementGetterNodeData;
    };
}

describe(
    "createGetterEmitter",
    () => {
        it(
            "generates getter wrapped in set_variable()",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_text",
                    );

                const code =
                    emitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "value",
    get_text(
        AppiumBy.ID,
        "username",
    ),
)`,
                );
            },
        );

        it(
            "supports different getter functions",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_size",
                    );

                const code =
                    emitter.emit(
                        createNode(
                            "id",
                            "element",
                            "elementSize",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementSize",
    get_size(
        AppiumBy.ID,
        "element",
    ),
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_text",
                    );

                const code =
                    emitter.emit(
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
                const emitter =
                    createGetterEmitter(
                        "get_displayed",
                    );

                const code =
                    emitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "isDisplayed",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isDisplayed",
    get_displayed(
        AppiumBy.XPATH,
        "//XCUIElementTypeButton[@name=\\"Login\\"]",
    ),
)`,
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_text",
                    );

                const code =
                    emitter.emit(
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
            "preserves empty locator",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_text",
                    );

                const code =
                    emitter.emit(
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
            "supports different variable names",
            () => {
                const emitter =
                    createGetterEmitter(
                        "get_attribute_value",
                    );

                const code =
                    emitter.emit(
                        createNode(
                            "id",
                            "email",
                            "emailValue",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "emailValue",
    get_attribute_value(
        AppiumBy.ID,
        "email",
    ),
)`,
                );
            },
        );
    },
);