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

describe("AssertEmitter", () => {
    it.each([
        [
            "equals",
            'assert resolve_variables("username") == resolve_variables("admin")',
        ],
        [
            "notEquals",
            'assert resolve_variables("username") != resolve_variables("admin")',
        ],
        [
            "contains",
            'assert resolve_variables("admin") in resolve_variables("username")',
        ],
        [
            "notContains",
            'assert resolve_variables("admin") not in resolve_variables("username")',
        ],
        [
            "startsWith",
            'assert resolve_variables("username").startswith(resolve_variables("admin"))',
        ],
        [
            "endsWith",
            'assert resolve_variables("username").endswith(resolve_variables("admin"))',
        ],
        [
            "greaterThan",
            'assert resolve_variables("username") > resolve_variables("admin")',
        ],
        [
            "greaterThanOrEqual",
            'assert resolve_variables("username") >= resolve_variables("admin")',
        ],
        [
            "lessThan",
            'assert resolve_variables("username") < resolve_variables("admin")',
        ],
        [
            "lessThanOrEqual",
            'assert resolve_variables("username") <= resolve_variables("admin")',
        ],
        [
            "isTrue",
            'assert resolve_variables("username")',
        ],
        [
            "isFalse",
            'assert not resolve_variables("username")',
        ],
        [
            "isEmpty",
            'assert len(resolve_variables("username")) == 0',
        ],
        [
            "isNotEmpty",
            'assert len(resolve_variables("username")) > 0',
        ],
        [
            "matches",
            'assert re.match(resolve_variables("admin"), resolve_variables("username"))',
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

    it("resolves runtime variables", () => {
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
            'assert resolve_variables("${usernameText}") == resolve_variables("Select a username from the list below")',
        );
    });

    it("quotes values correctly", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "equals",
                    "hello world",
                    "flow test",
                ),
                context,
            ),
        ).toBe(
            'assert resolve_variables("hello world") == resolve_variables("flow test")',
        );
    });

    it("supports empty expected value", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "equals",
                    "username",
                    "",
                ),
                context,
            ),
        ).toBe(
            'assert resolve_variables("username") == resolve_variables("")',
        );
    });
});