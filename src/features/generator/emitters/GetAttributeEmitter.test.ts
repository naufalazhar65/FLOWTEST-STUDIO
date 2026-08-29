import {
    describe,
    expect,
    it,
} from "vitest";

import { getAttributeEmitter } from "./GetAttributeEmitter";

import type {
    FlowNode,
    GetAttributeNodeData,
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
        GetAttributeNodeData["locatorStrategy"] =
        "id",
    locator = "username",
    attribute = "content-desc",
    variableName =
        "usernameAttribute",
): FlowNode & {
    data: GetAttributeNodeData;
} {
    return {
        id: "get-attribute-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getAttribute",

            title: "Get Attribute",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            attribute,

            variableName,
        },
    } as FlowNode & {
        data: GetAttributeNodeData;
    };
}

describe(
    "GetAttributeEmitter",
    () => {
        it(
            "generates get_attribute() with set_variable()",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "username",
        "content-desc",
    ),
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Username Field",
                            "label",
                            "usernameLabel",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameLabel",
    get_attribute(
        AppiumBy.ACCESSIBILITY_ID,
        "Username Field",
        "label",
    ),
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeTextField[@name="email"]',
                            "value",
                            "emailValue",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "emailValue",
    get_attribute(
        AppiumBy.XPATH,
        "//XCUIElementTypeTextField[@name=\\"email\\"]",
        "value",
    ),
)`,
                );
            },
        );

        it(
            "supports different attribute names",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            "username",
                            "text",
                            "usernameText",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameText",
    get_attribute(
        AppiumBy.ID,
        "username",
        "text",
    ),
)`,
                );
            },
        );

        it(
            "supports different variable names",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            "content-desc",
                            "buttonDescription",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonDescription",
    get_attribute(
        AppiumBy.ID,
        "login_button",
        "content-desc",
    ),
)`,
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            'user "name"',
                            "content-desc",
                            "usernameAttribute",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "user \\"name\\"",
        "content-desc",
    ),
)`,
                );
            },
        );

        it(
            "escapes special characters in attribute",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            "username",
                            'data-"value"',
                            "usernameAttribute",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "username",
        "data-\\"value\\"",
    ),
)`,
                );
            },
        );

        it(
            "supports empty attribute",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            "username",
                            "",
                            "usernameAttribute",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "username",
        "",
    ),
)`,
                );
            },
        );

        it(
            "supports empty locator",
            () => {
                const code =
                    getAttributeEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "content-desc",
                            "usernameAttribute",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "",
        "content-desc",
    ),
)`,
                );
            },
        );
    },
);