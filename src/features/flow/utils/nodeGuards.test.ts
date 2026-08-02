import { describe, expect, it } from "vitest";

import {
    isAssertNode,
    isDragNode,
    isDoubleTapNode,
    isFlingNode,
    isGetTextNode,
    isLongPressNode,
    isPinchNode,
    isTapNode,
    isZoomNode,
} from "./nodeGuards";

import type { FlowNode } from "../types/flowNode";

function createNode(action: string): FlowNode {
    return {
        id: "node-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action,
            title: action,
            subtitle: "",
            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode;
}

describe("nodeGuards", () => {
    const guards = [
        {
            name: "getText",
            action: "getText",
            guard: isGetTextNode,
        },
        {
            name: "assert",
            action: "assert",
            guard: isAssertNode,
        },
        {
            name: "tap",
            action: "tap",
            guard: isTapNode,
        },
        {
            name: "longPress",
            action: "longPress",
            guard: isLongPressNode,
        },
        {
            name: "doubleTap",
            action: "doubleTap",
            guard: isDoubleTapNode,
        },
        {
            name: "drag",
            action: "drag",
            guard: isDragNode,
        },
        {
            name: "pinch",
            action: "pinch",
            guard: isPinchNode,
        },
        {
            name: "zoom",
            action: "zoom",
            guard: isZoomNode,
        },
        {
            name: "fling",
            action: "fling",
            guard: isFlingNode,
        },
    ] as const;

    it.each(guards)(
        "returns true for $name node",
        ({ action, guard }) => {
            expect(
                guard(createNode(action)),
            ).toBe(true);
        },
    );

    it.each(guards)(
        "returns false for non-$name node",
        ({ action, guard }) => {
            expect(
                guard(createNode("tap")),
            ).toBe(action === "tap");
        },
    );
});