import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import { generatePython } from "./generatePython";

import type {
    FlowNode,
    RepeatNodeData,
    TapNodeData,
} from "../../flow/types/flowNode";

function createTapNode(
    id: string,
    locator: string,
): FlowNode & {
    data: TapNodeData;
} {
    return {
        id,
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
            locator,
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

function createRepeatNode(
    id: string,
    count: number,
): FlowNode & {
    data: RepeatNodeData;
} {
    return {
        id,
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "repeat",
            title: "Repeat",
            subtitle: "Repeat a flow section",
            debug: {
                breakpoint: false,
            },
            count,
        },
    } as FlowNode & {
        data: RepeatNodeData;
    };
}

function createEdge(
    id: string,
    source: string,
    target: string,
    sourceHandle?: string,
): Edge {
    return {
        id,
        source,
        target,
        type: "flow",
        animated: false,
        ...(sourceHandle !==
            undefined && {
            sourceHandle,
        }),
    };
}

describe(
    "generatePython Repeat",
    () => {
        it(
            "generates a repeat loop with the configured count",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const body =
                    createTapNode(
                        "tap-1",
                        "inside_loop",
                    );

                const exit =
                    createTapNode(
                        "tap-2",
                        "after_loop",
                    );

                const nodes = [
                    repeat,
                    body,
                    exit,
                ];

                const edges = [
                    createEdge(
                        "edge-body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),
                    createEdge(
                        "edge-next",
                        "repeat-1",
                        "tap-2",
                        "next",
                    ),
                    createEdge(
                        "edge-body-next",
                        "tap-1",
                        "tap-2",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                expect(code).toContain(
                    "for _ in range(3):",
                );

                expect(
                    code.indexOf(
                        "inside_loop",
                    ),
                ).toBeGreaterThan(
                    code.indexOf(
                        "for _ in range(3):",
                    ),
                );

                expect(
                    code.indexOf(
                        "after_loop",
                    ),
                ).toBeGreaterThan(
                    code.indexOf(
                        "inside_loop",
                    ),
                );
            },
        );

        it(
            "keeps multiple body nodes inside the repeat",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        4,
                    );

                const tap =
                    createTapNode(
                        "tap-1",
                        "tap_inside",
                    );

                const input =
                    createTapNode(
                        "tap-2",
                        "input_inside",
                    );

                const assertNode =
                    createTapNode(
                        "tap-3",
                        "assert_inside",
                    );

                const exit =
                    createTapNode(
                        "tap-4",
                        "after_repeat",
                    );

                const nodes = [
                    repeat,
                    tap,
                    input,
                    assertNode,
                    exit,
                ];

                const edges = [
                    createEdge(
                        "repeat-body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),
                    createEdge(
                        "repeat-next",
                        "repeat-1",
                        "tap-4",
                        "next",
                    ),
                    createEdge(
                        "tap-input",
                        "tap-1",
                        "tap-2",
                    ),
                    createEdge(
                        "input-assert",
                        "tap-2",
                        "tap-3",
                    ),
                    createEdge(
                        "assert-exit",
                        "tap-3",
                        "tap-4",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                const loopIndex =
                    code.indexOf(
                        "for _ in range(4):",
                    );

                const tapIndex =
                    code.indexOf(
                        "tap_inside",
                    );

                const inputIndex =
                    code.indexOf(
                        "input_inside",
                    );

                const assertIndex =
                    code.indexOf(
                        "assert_inside",
                    );

                const exitIndex =
                    code.indexOf(
                        "after_repeat",
                    );

                expect(loopIndex)
                    .toBeGreaterThanOrEqual(
                        0,
                    );

                expect(tapIndex)
                    .toBeGreaterThan(
                        loopIndex,
                    );

                expect(inputIndex)
                    .toBeGreaterThan(
                        tapIndex,
                    );

                expect(assertIndex)
                    .toBeGreaterThan(
                        inputIndex,
                    );

                expect(exitIndex)
                    .toBeGreaterThan(
                        assertIndex,
                    );

                const loopBody =
                    code.slice(
                        loopIndex,
                        exitIndex,
                    );

                expect(
                    loopBody,
                ).toContain(
                    "tap_inside",
                );

                expect(
                    loopBody,
                ).toContain(
                    "input_inside",
                );

                expect(
                    loopBody,
                ).toContain(
                    "assert_inside",
                );
            },
        );

        it(
            "does not generate the repeat exit node inside the loop",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        2,
                    );

                const body =
                    createTapNode(
                        "tap-1",
                        "body_node",
                    );

                const exit =
                    createTapNode(
                        "tap-2",
                        "exit_node",
                    );

                const after =
                    createTapNode(
                        "tap-3",
                        "after_exit",
                    );

                const nodes = [
                    repeat,
                    body,
                    exit,
                    after,
                ];

                const edges = [
                    createEdge(
                        "body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),
                    createEdge(
                        "next",
                        "repeat-1",
                        "tap-2",
                        "next",
                    ),
                    createEdge(
                        "body-next",
                        "tap-1",
                        "tap-2",
                    ),
                    createEdge(
                        "exit-next",
                        "tap-2",
                        "tap-3",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                const loopStart =
                    code.indexOf(
                        "for _ in range(2):",
                    );

                const exitIndex =
                    code.indexOf(
                        "exit_node",
                    );

                const afterIndex =
                    code.indexOf(
                        "after_exit",
                    );

                expect(
                    exitIndex,
                ).toBeGreaterThan(
                    loopStart,
                );

                expect(
                    afterIndex,
                ).toBeGreaterThan(
                    exitIndex,
                );

                const loopSection =
                    code.slice(
                        loopStart,
                        exitIndex,
                    );

                expect(
                    loopSection,
                ).not.toContain(
                    "exit_node",
                );
            },
        );

        it(
            "supports a repeat nested inside another repeat",
            () => {
                const outer =
                    createRepeatNode(
                        "repeat-outer",
                        3,
                    );

                const outerBody =
                    createTapNode(
                        "tap-outer",
                        "outer_body",
                    );

                const inner =
                    createRepeatNode(
                        "repeat-inner",
                        2,
                    );

                const innerBody =
                    createTapNode(
                        "tap-inner",
                        "inner_body",
                    );

                const innerExit =
                    createTapNode(
                        "tap-inner-exit",
                        "inner_exit",
                    );

                const outerExit =
                    createTapNode(
                        "tap-outer-exit",
                        "outer_exit",
                    );

                const nodes = [
                    outer,
                    outerBody,
                    inner,
                    innerBody,
                    innerExit,
                    outerExit,
                ];

                const edges = [
                    createEdge(
                        "outer-body",
                        "repeat-outer",
                        "tap-outer",
                        "body",
                    ),
                    createEdge(
                        "outer-next",
                        "repeat-outer",
                        "tap-outer-exit",
                        "next",
                    ),
                    createEdge(
                        "outer-body-chain",
                        "tap-outer",
                        "repeat-inner",
                    ),
                    createEdge(
                        "inner-body",
                        "repeat-inner",
                        "tap-inner",
                        "body",
                    ),
                    createEdge(
                        "inner-next",
                        "repeat-inner",
                        "tap-inner-exit",
                        "next",
                    ),
                    createEdge(
                        "inner-body-chain",
                        "tap-inner",
                        "tap-inner-exit",
                    ),
                    createEdge(
                        "inner-exit-chain",
                        "tap-inner-exit",
                        "tap-outer-exit",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                const outerLoop =
                    code.indexOf(
                        "for _ in range(3):",
                    );

                const innerLoop =
                    code.indexOf(
                        "for _ in range(2):",
                    );

                const outerBodyIndex =
                    code.indexOf(
                        "outer_body",
                    );

                const innerBodyIndex =
                    code.indexOf(
                        "inner_body",
                    );

                const innerExitIndex =
                    code.indexOf(
                        "inner_exit",
                    );

                const outerExitIndex =
                    code.indexOf(
                        "outer_exit",
                    );

                expect(
                    outerLoop,
                ).toBeGreaterThanOrEqual(
                    0,
                );

                expect(
                    innerLoop,
                ).toBeGreaterThan(
                    outerLoop,
                );

                expect(
                    outerBodyIndex,
                ).toBeGreaterThan(
                    outerLoop,
                );

                expect(
                    innerBodyIndex,
                ).toBeGreaterThan(
                    innerLoop,
                );

                expect(
                    innerExitIndex,
                ).toBeGreaterThan(
                    innerBodyIndex,
                );

                expect(
                    outerExitIndex,
                ).toBeGreaterThan(
                    innerExitIndex,
                );
            },
        );

        it(
            "throws when repeat body transition is missing",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const exit =
                    createTapNode(
                        "tap-1",
                        "after_repeat",
                    );

                const nodes = [
                    repeat,
                    exit,
                ];

                const edges = [
                    createEdge(
                        "next",
                        "repeat-1",
                        "tap-1",
                        "next",
                    ),
                ];

                expect(() =>
                    generatePython(
                        nodes,
                        { edges },
                    ),
                ).toThrow(
                    'Repeat node "Repeat" has no body transition.',
                );
            },
        );

        it(
            "throws when repeat next transition is missing",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const body =
                    createTapNode(
                        "tap-1",
                        "inside_loop",
                    );

                const nodes = [
                    repeat,
                    body,
                ];

                const edges = [
                    createEdge(
                        "body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),
                ];

                expect(() =>
                    generatePython(
                        nodes,
                        { edges },
                    ),
                ).toThrow(
                    'Repeat node "Repeat" has no next transition.',
                );
            },
        );
    },
);