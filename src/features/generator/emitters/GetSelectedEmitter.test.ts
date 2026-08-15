import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getSelectedEmitter,
} from "./GetSelectedEmitter";

import type {
    FlowNode,
    GetSelectedNodeData,
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
        GetSelectedNodeData["locatorStrategy"] =
        "id",
    locator = "remember_me",
    variableName = "isSelected",
): FlowNode & {
    data: GetSelectedNodeData;
} {
    return {
        id: "get-selected-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getSelected",

            title: "Get Selected",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            variableName,
        },
    } as FlowNode & {
        data: GetSelectedNodeData;
    };
}

describe(
    "GetSelectedEmitter",
    () => {
        it(
            "generates get_selected() with set_variable()",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isSelected",
    get_selected(
        AppiumBy.ID,
        "remember_me",
    ),
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Remember Me",
                            "rememberSelected",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "rememberSelected",
    get_selected(
        AppiumBy.ACCESSIBILITY_ID,
        "Remember Me",
    ),
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeSwitch[@name="Remember Me"]',
                            "switchSelected",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "switchSelected",
    get_selected(
        AppiumBy.XPATH,
        "//XCUIElementTypeSwitch[@name=\\"Remember Me\\"]",
    ),
)`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "id",
                            "remember_me",
                            "selectedState",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "selectedState",
    get_selected(
        AppiumBy.ID,
        "remember_me",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in locator",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "id",
                            'remember "me"',
                            "isSelected",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isSelected",
    get_selected(
        AppiumBy.ID,
        "remember \\"me\\"",
    ),
)`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "id",
                            "remember_me",
                            'is"Selected',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "is\\"Selected",
    get_selected(
        AppiumBy.ID,
        "remember_me",
    ),
)`,
                );
            },
        );

        it(
            "supports an empty locator",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(
                            "id",
                            "",
                            "isSelected",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "isSelected",
    get_selected(
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
                    getSelectedEmitter.emit(
                        createNode(
                            "id",
                            "remember_me",
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `set_variable(
    "",
    get_selected(
        AppiumBy.ID,
        "remember_me",
    ),
)`,
                );
            },
        );

        it(
            "keeps getter indentation nested inside set_variable",
            () => {
                const code =
                    getSelectedEmitter.emit(
                        createNode(),
                        context,
                    );

                const lines =
                    code.split("\n");

                expect(lines[0]).toBe(
                    "set_variable(",
                );

                expect(lines[1]).toBe(
                    '    "isSelected",',
                );

                expect(lines[2]).toBe(
                    "    get_selected(",
                );

                expect(lines[3]).toBe(
                    "        AppiumBy.ID,",
                );

                expect(lines[4]).toBe(
                    '        "remember_me",',
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
                    getSelectedEmitter.emit(
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
                    getSelectedEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getSelectedEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `set_variable(
    "isSelected",
    get_selected(
        AppiumBy.ID,
        "remember_me",
    ),
)`,
                );
            },
        );
    },
);