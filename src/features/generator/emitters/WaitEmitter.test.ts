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

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
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

            locatorStrategy: "id",

            locator: "login_button",

            timeout: 10000,

            pollingInterval: 500,
        },
    } as FlowNode & {
        data: WaitNodeData;
    };
}

describe("WaitEmitter", () => {
    it("generates wait_until_visible()", () => {
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
    });
});