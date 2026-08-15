import {
    describe,
    expect,
    it,
} from "vitest";

import { inputEmitter } from "./InputEmitter";

import type {
    FlowNode,
    InputNodeData,
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
    text = "admin",
    locatorStrategy:
        InputNodeData["locatorStrategy"] = "id",
    locator = "username",
): FlowNode & {
    data: InputNodeData;
} {
    return {
        id: "input-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "input",

            title: "Input",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            text,
        },
    } as FlowNode & {
        data: InputNodeData;
    };
}

describe(
    "InputEmitter",
    () => {
        it(
            "generates python input_text()",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    "admin",
)`,
                );
            },
        );

        it(
            "resolves runtime variables in input text",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            "${usernameText}",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    resolve_variables("\${usernameText}"),
)`,
                );
            },
        );

        it(
            "preserves literal text values",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            "hello world",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    "hello world",
)`,
                );
            },
        );

        it(
            "escapes special characters",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            'hello "world"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    "hello \\"world\\"",
)`,
                );
            },
        );

        it(
            "preserves empty text",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    "",
)`,
                );
            },
        );

        it(
            "supports different locator strategies",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            "admin",
                            "accessibilityId",
                            "Username Field",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ACCESSIBILITY_ID,
    "Username Field",
    "admin",
)`,
                );
            },
        );

        it(
            "supports variable text with different locator strategy",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            "${email}",
                            "xpath",
                            '//XCUIElementTypeTextField[@name="email"]',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.XPATH,
    "//XCUIElementTypeTextField[@name=\\\"email\\\"]",
    resolve_variables("\${email}"),
)`,
                );
            },
        );

        it(
            "does not treat partial variable syntax as a variable",
            () => {
                const code =
                    inputEmitter.emit(
                        createNode(
                            "hello ${username",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `input_text(
    AppiumBy.ID,
    "username",
    "hello \${username",
)`,
                );
            },
        );
    },
);