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

            actual: "username",

            expected: "admin",

            operator,
        },
    } as FlowNode & {
        data: AssertNodeData;
    };
}

describe("AssertEmitter", () => {
    it("generates equals assertion", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "equals",
                ),
                context,
            ),
        ).toBe(
            'assert "username" == "admin"',
        );
    });

    it("generates notEquals assertion", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "notEquals",
                ),
                context,
            ),
        ).toBe(
            'assert "username" != "admin"',
        );
    });

    it("generates contains assertion", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "contains",
                ),
                context,
            ),
        ).toBe(
            'assert "admin" in "username"',
        );
    });

    it("generates startsWith assertion", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "startsWith",
                ),
                context,
            ),
        ).toBe(
            'assert "username".startswith("admin")',
        );
    });

    it("generates isTrue assertion", () => {
        expect(
            assertEmitter.emit(
                createNode(
                    "isTrue",
                ),
                context,
            ),
        ).toBe(
            'assert "username"',
        );
    });
});