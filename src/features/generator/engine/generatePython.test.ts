import {
    describe,
    expect,
    it,
} from "vitest";

import { generatePython } from "./generatePython";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

function createTapNode(): FlowNode & {
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

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

describe("generatePython", () => {
    it("generates python test", () => {
        const code = generatePython([
            createTapNode(),
        ]);

        expect(code).toContain(
            "from framework.driver import create_driver",
        );

        expect(code).toContain(
            "from framework.actions import *",
        );

        expect(code).toContain(
            "from framework.variables import *",
        );

        expect(code).toContain(
            "def test_generated():",
        );

        expect(code).toContain(
            "tap(",
        );

        expect(code).toContain(
            "AppiumBy.ID",
        );

        expect(code).toContain(
            `"login_button"`,
        );

        expect(code).toContain(
            "driver.quit()",
        );
    });

    it("generates one tap()", () => {
        const code = generatePython([
            createTapNode(),
        ]);

        expect(
            code.match(/tap\(/g),
        ).toHaveLength(1);
    });

    it("throws when emitter is missing", () => {
        const node =
            createTapNode();

        node.data = {
            ...node.data,

            action:
                "unknownAction",
        } as never;

        expect(() =>
            generatePython([node]),
        ).toThrow(
            'No emitter registered for "unknownAction"',
        );
    });

    it("generates multiple nodes in order", () => {
        const nodes = [
            createTapNode(),
            createTapNode(),
        ];

        nodes[1].id = "tap-2";

        nodes[1].data.locator =
            "password";

        const code =
            generatePython(nodes);

        expect(
            code.indexOf(
                "login_button",
            ),
        ).toBeLessThan(
            code.indexOf(
                "password",
            ),
        );
    });
});