import {
    describe,
    expect,
    it,
} from "vitest";

import { setVariableEmitter } from "./SetVariableEmitter";

import type {
    FlowNode,
    SetVariableNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: SetVariableNodeData;
} {
    return {
        id: "set-variable-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "setVariable",

            title: "Set Variable",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "username",

            value: "admin",
        },
    } as FlowNode & {
        data: SetVariableNodeData;
    };
}

describe("SetVariableEmitter", () => {
    it("generates set_variable()", () => {
        const code =
            setVariableEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `set_variable(
    "username",
    "admin",
)`,
        );
    });

    it("escapes variable values", () => {
        const node = createNode();

        node.data.value =
            'hello "world"';

        const code =
            setVariableEmitter.emit(
                node,
                context,
            );

        expect(code).toBe(
            `set_variable(
    "username",
    "hello \\"world\\"",
)`,
        );
    });

    it(
        "resolves runtime variables in values",
        () => {
            const node =
                createNode();

            node.data.value =
                "${usernameText}";

            const code =
                setVariableEmitter.emit(
                    node,
                    context,
                );

            expect(code).toBe(
                `set_variable(
    "username",
    resolve_variables("\${usernameText}"),
)`,
            );
        },
    );

    it(
        "keeps partial variable syntax as a literal",
        () => {
            const node =
                createNode();

            node.data.value =
                "hello ${username";

            const code =
                setVariableEmitter.emit(
                    node,
                    context,
                );

            expect(code).toBe(
                `set_variable(
    "username",
    "hello \${username",
)`,
            );
        },
    );
});