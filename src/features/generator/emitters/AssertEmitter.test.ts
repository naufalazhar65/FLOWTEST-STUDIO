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
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(
    operator: AssertNodeData["operator"],
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
            'assert "hello world" == "flow test"',
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
            'assert "username" == ""',
        );
    });
});