import {
    describe,
    expect,
    it,
} from "vitest";

import {
    tapEmitter,
} from "./TapEmitter";

import type {
    FlowNode,
    TapNodeData,
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

function createTapNode(
    locatorStrategy:
        TapNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
): FlowNode & {
    data: TapNodeData;
} {
    return {
        id: "tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: "Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

describe(
    "TapEmitter",
    () => {
        it(
            "generates tap() with id locator",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.ID,
    "login_button",
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(
                            "accessibilityId",
                            "Login Button",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.ACCESSIBILITY_ID,
    "Login Button",
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.XPATH,
    "//XCUIElementTypeButton[@name=\\"Login\\"]",
)`,
                );
            },
        );

        it(
            "supports different locator values",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(
                            "id",
                            "submit_button",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.ID,
    "submit_button",
)`,
                );
            },
        );

        it(
            "escapes double quotes in locator",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(
                            "id",
                            'login "button"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.ID,
    "login \\"button\\"",
)`,
                );
            },
        );

        it(
            "supports an empty locator",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(
                            "id",
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `tap(
    AppiumBy.ID,
    "",
)`,
                );
            },
        );

        it(
            "keeps arguments correctly indented",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "tap(",
                );

                expect(lines[1]).toBe(
                    "    AppiumBy.ID,",
                );

                expect(lines[2]).toBe(
                    '    "login_button",',
                );

                expect(lines[3]).toBe(
                    ")",
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    tapEmitter.emit(
                        createTapNode(),
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
                    tapEmitter.emit(
                        createTapNode(),
                        context,
                    );

                const second =
                    tapEmitter.emit(
                        createTapNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `tap(
    AppiumBy.ID,
    "login_button",
)`,
                );
            },
        );
    },
);