import {
    describe,
    expect,
    it,
} from "vitest";

import { waitEmitter } from "./WaitEmitter";

import type {
    FlowNode,
    WaitNodeData,
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
    timeout = 10000,
    pollingInterval = 500,
    locatorStrategy:
        WaitNodeData["locatorStrategy"] = "id",
    locator = "login_button",
): FlowNode & {
    data: WaitNodeData;
} {
    return {
        id: "wait-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "wait",

            title: "Wait Until Element",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            timeout,

            pollingInterval,
        },
    } as FlowNode & {
        data: WaitNodeData;
    };
}

describe(
    "WaitEmitter",
    () => {
        it(
            "generates wait_until_visible()",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ID,
    "login_button",
    10,
    0.5,
)`,
                );
            },
        );

        it(
            "converts timeout from milliseconds to seconds",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            5000,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ID,
    "login_button",
    5,
    0.5,
)`,
                );
            },
        );

        it(
            "converts polling interval from milliseconds to seconds",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            10000,
                            250,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ID,
    "login_button",
    10,
    0.25,
)`,
                );
            },
        );

        it(
            "supports zero timeout and polling interval",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            0,
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ID,
    "login_button",
    0,
    0,
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            3000,
                            500,
                            "accessibilityId",
                            "Login Button",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ACCESSIBILITY_ID,
    "Login Button",
    3,
    0.5,
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            15000,
                            1000,
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.XPATH,
    "//XCUIElementTypeButton[@name=\\\"Login\\\"]",
    15,
    1,
)`,
                );
            },
        );

        it(
            "preserves decimal seconds",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            1250,
                            125,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `wait_until_visible(
    AppiumBy.ID,
    "login_button",
    1.25,
    0.125,
)`,
                );
            },
        );

        it(
            "does not quote numeric arguments",
            () => {
                const code =
                    waitEmitter.emit(
                        createNode(
                            3000,
                            500,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"3"',
                );

                expect(code).not.toContain(
                    '"0.5"',
                );

                expect(code).toContain(
                    "3",
                );

                expect(code).toContain(
                    "0.5",
                );
            },
        );
    },
);