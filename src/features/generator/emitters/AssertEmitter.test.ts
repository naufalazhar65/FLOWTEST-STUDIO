import {
    describe,
    expect,
    it,
} from "vitest";

import { assertEmitter } from "./AssertEmitter";

import type {
    AssertNodeData,
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
    operator:
        AssertNodeData["operator"],
    actual = "username",
    expected = "admin",
): FlowNode & {
    data: AssertNodeData;
} {
    return {
        id: "assert-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "assert",

            title: "Assert",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            actual,

            expected,

            operator,
        },
    } as FlowNode & {
        data: AssertNodeData;
    };
}

describe(
    "AssertEmitter",
    () => {
        it.each([
            [
                "equals",
                'assert "username" == "admin"',
            ],
            [
                "notEquals",
                'assert "username" != "admin"',
            ],
            [
                "contains",
                'assert "admin" in "username"',
            ],
            [
                "notContains",
                'assert "admin" not in "username"',
            ],
            [
                "startsWith",
                'assert "username".startswith("admin")',
            ],
            [
                "endsWith",
                'assert "username".endswith("admin")',
            ],
            [
                "greaterThan",
                'assert "username" > "admin"',
            ],
            [
                "greaterThanOrEqual",
                'assert "username" >= "admin"',
            ],
            [
                "lessThan",
                'assert "username" < "admin"',
            ],
            [
                "lessThanOrEqual",
                'assert "username" <= "admin"',
            ],
            [
                "isTrue",
                'assert "username"',
            ],
            [
                "isFalse",
                'assert not "username"',
            ],
            [
                "isEmpty",
                'assert len("username") == 0',
            ],
            [
                "isNotEmpty",
                'assert len("username") > 0',
            ],
            [
                "matches",
                'assert re.match("admin", "username")',
            ],
        ] as const)(
            "generates %s assertion",
            (
                operator,
                expected,
            ) => {
                expect(
                    assertEmitter.emit(
                        createNode(operator),
                        context,
                    ),
                ).toBe(expected);
            },
        );

        it(
            "resolves runtime variables",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            "${usernameText}",
                            "Select a username from the list below",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert resolve_variables("${usernameText}") == "Select a username from the list below"',
                );
            },
        );

        it(
            "resolves runtime variables on both sides",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            "${actualValue}",
                            "${expectedValue}",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert resolve_variables("${actualValue}") == resolve_variables("${expectedValue}")',
                );
            },
        );

        it(
            "quotes literal values correctly",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            "hello world",
                            "flow test",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert "hello world" == "flow test"',
                );
            },
        );

        it(
            "preserves empty literal values",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            "username",
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert "username" == ""',
                );
            },
        );

        it(
            "preserves special characters in literal values",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            'hello "world"',
                            "line\nbreak",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert "hello \\"world\\"" == "line\\nbreak"',
                );
            },
        );

        it(
            "does not treat partial variable syntax as a variable",
            () => {
                const code =
                    assertEmitter.emit(
                        createNode(
                            "equals",
                            "username ${value",
                            "admin",
                        ),
                        context,
                    );

                expect(code).toBe(
                    'assert "username ${value" == "admin"',
                );
            },
        );
    },
);