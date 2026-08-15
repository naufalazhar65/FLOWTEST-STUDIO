import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getLocationEmitter,
} from "./GetLocationEmitter";

import type {
    FlowNode,
    GetLocationNodeData,
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
        GetLocationNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    variableName = "location",
): FlowNode & {
    data: GetLocationNodeData;
} {
    return {
        id: "get-location-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getLocation",

            title: "Get Location",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetLocationNodeData;
    };
}

describe(
    "GetLocationEmitter",
    () => {
        it(
            "generates get_location() with set_variable()",
            () => {
                const code =
                    getLocationEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "location",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            "elementLocation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "elementLocation",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            "buttonLocation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "buttonLocation",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "id",
                            "submit_button",
                            "submitLocation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "submitLocation",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            "location",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "location",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            'element"Location',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "element\\"Location",
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "location",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "location",
    get_location(
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
                    getLocationEmitter.emit(
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
    get_location(
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
                    getLocationEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "location",',
                );

                expect(lines[2]).toBe(
                    "    get_location(",
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
                    getLocationEmitter.emit(
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
                    getLocationEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getLocationEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "location",
    get_location(
        AppiumBy.ID,
        "login_button",
    ),
)`,
                );
            },
        );
    },
);