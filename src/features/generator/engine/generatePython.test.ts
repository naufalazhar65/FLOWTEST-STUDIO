import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import { generatePython } from "./generatePython";

import type {
    FlowNode,
    IfNodeData,
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

function createIfNode(
    id: string,
    actual: string,
    operator: IfNodeData["operator"],
    expected: string,
): FlowNode & {
    data: IfNodeData;
} {
    return {
        id,

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "if",

            title: "If",

            subtitle: "Condition",

            debug: {
                breakpoint: false,
            },

            actual,

            operator,

            expected,
        },
    } as FlowNode & {
        data: IfNodeData;
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

        it(
            "throws when repeat has no body transition",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const exit =
                    createTapNode(
                        "tap-exit",
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
                        "tap-exit",
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
            "throws when repeat has no next transition",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const body =
                    createTapNode(
                        "tap-body",
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
                        "tap-body",
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
        it(
            "falls back to one iteration for a non-numeric repeat count",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        Number.NaN,
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
                        "repeat-body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),

                    createEdge(
                        "repeat-next",
                        "repeat-1",
                        "tap-2",
                        "next",
                    ),

                    createEdge(
                        "body-exit",
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
                    "for _ in range(1):",
                );

                expect(code).not.toContain(
                    "range(NaN)",
                );
            },
        );

        it(
            "falls back to one iteration for an infinite repeat count",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        Infinity,
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
                        "repeat-body",
                        "repeat-1",
                        "tap-1",
                        "body",
                    ),

                    createEdge(
                        "repeat-next",
                        "repeat-1",
                        "tap-2",
                        "next",
                    ),

                    createEdge(
                        "body-exit",
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
                    "for _ in range(1):",
                );

                expect(code).not.toContain(
                    "Infinity",
                );
            },
        );

        it(
            "generates an empty test body when graph has no start node",
            () => {
                const first =
                    createTapNode(
                        "tap-1",
                        "first",
                    );

                const second =
                    createTapNode(
                        "tap-2",
                        "second",
                    );

                const nodes = [
                    first,
                    second,
                ];

                const edges = [
                    createEdge(
                        "edge-1",
                        "tap-1",
                        "tap-2",
                    ),

                    createEdge(
                        "edge-2",
                        "tap-2",
                        "tap-1",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                expect(code).not.toContain(
                    "first",
                );

                expect(code).not.toContain(
                    "second",
                );

                expect(code).toContain(
                    "def test_generated():",
                );
            },
        );
    },
);

describe(
    "generatePython IF",
    () => {
        it(
            "generates an IF with a true branch",
            () => {
                const ifNode =
                    createIfNode(
                        "if-1",
                        "username",
                        "equals",
                        "admin",
                    );

                const body =
                    createTapNode(
                        "tap-1",
                        "inside_if",
                    );

                const exit =
                    createTapNode(
                        "tap-2",
                        "after_if",
                    );

                const nodes = [
                    ifNode,
                    body,
                    exit,
                ];

                const edges = [
                    createEdge(
                        "if-true",
                        "if-1",
                        "tap-1",
                        "true",
                    ),

                    createEdge(
                        "if-false",
                        "if-1",
                        "tap-2",
                        "false",
                    ),

                    createEdge(
                        "body-next",
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
                    'if compare("username", "admin", "equals"):',
                );

                expect(
                    code.indexOf(
                        "inside_if",
                    ),
                ).toBeGreaterThan(
                    code.indexOf(
                        'if compare("username", "admin", "equals"):',
                    ),
                );

                expect(
                    code.indexOf(
                        "after_if",
                    ),
                ).toBeGreaterThan(
                    code.indexOf(
                        "inside_if",
                    ),
                );
            },
        );

        it(
            "generates IF with true and false branches",
            () => {
                const ifNode =
                    createIfNode(
                        "if-1",
                        "${username}",
                        "equals",
                        "admin",
                    );

                const trueNode =
                    createTapNode(
                        "tap-true",
                        "true_branch",
                    );

                const falseNode =
                    createTapNode(
                        "tap-false",
                        "false_branch",
                    );

                const exitNode =
                    createTapNode(
                        "tap-exit",
                        "after_if",
                    );

                const nodes = [
                    ifNode,
                    trueNode,
                    falseNode,
                    exitNode,
                ];

                const edges = [
                    createEdge(
                        "if-true",
                        "if-1",
                        "tap-true",
                        "true",
                    ),

                    createEdge(
                        "if-false",
                        "if-1",
                        "tap-false",
                        "false",
                    ),

                    createEdge(
                        "true-exit",
                        "tap-true",
                        "tap-exit",
                    ),

                    createEdge(
                        "false-exit",
                        "tap-false",
                        "tap-exit",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                expect(code).toContain(
                    'if compare(resolve_variables("${username}"), "admin", "equals"):',
                );

                expect(code).toContain(
                    "else:",
                );

                expect(code).toContain(
                    "true_branch",
                );

                expect(code).toContain(
                    "false_branch",
                );

                expect(code).toContain(
                    "after_if",
                );

                const ifIndex =
                    code.indexOf(
                        'if compare(resolve_variables("${username}"), "admin", "equals"):',
                    );

                const elseIndex =
                    code.indexOf("else:");

                const trueIndex =
                    code.indexOf(
                        "true_branch",
                    );

                const falseIndex =
                    code.indexOf(
                        "false_branch",
                    );

                const exitIndex =
                    code.indexOf(
                        "after_if",
                    );

                expect(ifIndex).toBeGreaterThanOrEqual(
                    0,
                );

                expect(trueIndex).toBeGreaterThan(
                    ifIndex,
                );

                expect(elseIndex).toBeGreaterThan(
                    trueIndex,
                );

                expect(falseIndex).toBeGreaterThan(
                    elseIndex,
                );

                expect(exitIndex).toBeGreaterThan(
                    falseIndex,
                );
            },
        );

        it(
            "supports nested IF inside a true branch",
            () => {
                const outerIf =
                    createIfNode(
                        "if-outer",
                        "user",
                        "equals",
                        "admin",
                    );

                const innerIf =
                    createIfNode(
                        "if-inner",
                        "role",
                        "equals",
                        "qa",
                    );

                const innerTrue =
                    createTapNode(
                        "tap-inner-true",
                        "inner_true",
                    );

                const innerFalse =
                    createTapNode(
                        "tap-inner-false",
                        "inner_false",
                    );

                const outerFalse =
                    createTapNode(
                        "tap-outer-false",
                        "outer_false",
                    );

                const exit =
                    createTapNode(
                        "tap-exit",
                        "after_nested_if",
                    );

                const nodes = [
                    outerIf,
                    innerIf,
                    innerTrue,
                    innerFalse,
                    outerFalse,
                    exit,
                ];

                const edges = [
                    // Outer IF
                    createEdge(
                        "outer-true",
                        "if-outer",
                        "if-inner",
                        "true",
                    ),

                    createEdge(
                        "outer-false",
                        "if-outer",
                        "tap-outer-false",
                        "false",
                    ),

                    // Inner IF
                    createEdge(
                        "inner-true",
                        "if-inner",
                        "tap-inner-true",
                        "true",
                    ),

                    createEdge(
                        "inner-false",
                        "if-inner",
                        "tap-inner-false",
                        "false",
                    ),

                    // Inner branches join outer exit
                    createEdge(
                        "inner-true-exit",
                        "tap-inner-true",
                        "tap-exit",
                    ),

                    createEdge(
                        "inner-false-exit",
                        "tap-inner-false",
                        "tap-exit",
                    ),

                    // Outer false branch joins same exit
                    createEdge(
                        "outer-false-exit",
                        "tap-outer-false",
                        "tap-exit",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                expect(code).toContain(
                    'if compare("user", "admin", "equals"):',
                );

                expect(code).toContain(
                    'if compare("role", "qa", "equals"):',
                );

                expect(code).toContain(
                    "inner_true",
                );

                expect(code).toContain(
                    "inner_false",
                );

                expect(code).toContain(
                    "outer_false",
                );

                expect(code).toContain(
                    "after_nested_if",
                );

                const outerIfIndex =
                    code.indexOf(
                        'if compare("user", "admin", "equals"):',
                    );

                const innerIfIndex =
                    code.indexOf(
                        'if compare("role", "qa", "equals"):',
                    );

                const innerTrueIndex =
                    code.indexOf(
                        "inner_true",
                    );

                const innerFalseIndex =
                    code.indexOf(
                        "inner_false",
                    );

                const outerFalseIndex =
                    code.indexOf(
                        "outer_false",
                    );

                const exitIndex =
                    code.indexOf(
                        "after_nested_if",
                    );

                expect(outerIfIndex)
                    .toBeGreaterThanOrEqual(0);

                expect(innerIfIndex)
                    .toBeGreaterThan(
                        outerIfIndex,
                    );

                expect(innerTrueIndex)
                    .toBeGreaterThan(
                        innerIfIndex,
                    );

                expect(innerFalseIndex)
                    .toBeGreaterThan(
                        innerTrueIndex,
                    );

                expect(outerFalseIndex)
                    .toBeGreaterThan(
                        innerFalseIndex,
                    );

                expect(exitIndex)
                    .toBeGreaterThan(
                        outerFalseIndex,
                    );
            },
        );
    },
);

describe(
    "generatePython Mixed Control Flow",
    () => {
        it(
            "supports IF inside REPEAT",
            () => {
                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const ifNode =
                    createIfNode(
                        "if-1",
                        "user",
                        "equals",
                        "admin",
                    );

                const trueNode =
                    createTapNode(
                        "tap-true",
                        "admin_button",
                    );

                const falseNode =
                    createTapNode(
                        "tap-false",
                        "guest_button",
                    );

                const exit =
                    createTapNode(
                        "tap-exit",
                        "after_repeat",
                    );

                const nodes = [
                    repeat,
                    ifNode,
                    trueNode,
                    falseNode,
                    exit,
                ];

                const edges = [
                    // Repeat
                    createEdge(
                        "repeat-body",
                        "repeat-1",
                        "if-1",
                        "body",
                    ),

                    createEdge(
                        "repeat-next",
                        "repeat-1",
                        "tap-exit",
                        "next",
                    ),

                    // IF
                    createEdge(
                        "if-true",
                        "if-1",
                        "tap-true",
                        "true",
                    ),

                    createEdge(
                        "if-false",
                        "if-1",
                        "tap-false",
                        "false",
                    ),

                    // IF branches return to repeat exit
                    createEdge(
                        "true-next",
                        "tap-true",
                        "tap-exit",
                    ),

                    createEdge(
                        "false-next",
                        "tap-false",
                        "tap-exit",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                const repeatIndex =
                    code.indexOf(
                        "for _ in range(3):",
                    );

                const ifIndex =
                    code.indexOf(
                        'if compare("user", "admin", "equals"):',
                    );

                const trueIndex =
                    code.indexOf(
                        "admin_button",
                    );

                const falseIndex =
                    code.indexOf(
                        "guest_button",
                    );

                const exitIndex =
                    code.indexOf(
                        "after_repeat",
                    );

                expect(repeatIndex)
                    .toBeGreaterThanOrEqual(
                        0,
                    );

                expect(ifIndex)
                    .toBeGreaterThan(
                        repeatIndex,
                    );

                expect(trueIndex)
                    .toBeGreaterThan(
                        ifIndex,
                    );

                expect(falseIndex)
                    .toBeGreaterThan(
                        trueIndex,
                    );

                expect(exitIndex)
                    .toBeGreaterThan(
                        falseIndex,
                    );

                const loopSection =
                    code.slice(
                        repeatIndex,
                        exitIndex,
                    );

                expect(
                    loopSection,
                ).toContain(
                    'if compare("user", "admin", "equals"):',
                );

                expect(
                    loopSection,
                ).toContain(
                    "admin_button",
                );

                expect(
                    loopSection,
                ).toContain(
                    "guest_button",
                );

                expect(
                    loopSection,
                ).not.toContain(
                    "after_repeat",
                );
            },
        );
    },
);

describe(
    "generatePython Mixed Control Flow",
    () => {
        it(
            "supports REPEAT inside IF",
            () => {
                const ifNode =
                    createIfNode(
                        "if-1",
                        "user",
                        "equals",
                        "admin",
                    );

                const repeat =
                    createRepeatNode(
                        "repeat-1",
                        3,
                    );

                const body =
                    createTapNode(
                        "tap-body",
                        "inside_repeat",
                    );

                const exit =
                    createTapNode(
                        "tap-exit",
                        "after_if",
                    );

                const nodes = [
                    ifNode,
                    repeat,
                    body,
                    exit,
                ];

                const edges = [
                    // IF
                    createEdge(
                        "if-true",
                        "if-1",
                        "repeat-1",
                        "true",
                    ),

                    // REPEAT
                    createEdge(
                        "repeat-body",
                        "repeat-1",
                        "tap-body",
                        "body",
                    ),

                    createEdge(
                        "repeat-next",
                        "repeat-1",
                        "tap-exit",
                        "next",
                    ),

                    // Repeat body finishes at IF exit
                    createEdge(
                        "body-exit",
                        "tap-body",
                        "tap-exit",
                    ),

                    // IF false branch also exits
                    createEdge(
                        "if-false",
                        "if-1",
                        "tap-exit",
                        "false",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                const ifIndex =
                    code.indexOf(
                        'if compare("user", "admin", "equals"):',
                    );

                const repeatIndex =
                    code.indexOf(
                        "for _ in range(3):",
                    );

                const bodyIndex =
                    code.indexOf(
                        "inside_repeat",
                    );

                const exitIndex =
                    code.indexOf(
                        "after_if",
                    );

                expect(ifIndex)
                    .toBeGreaterThanOrEqual(
                        0,
                    );

                expect(repeatIndex)
                    .toBeGreaterThan(
                        ifIndex,
                    );

                expect(bodyIndex)
                    .toBeGreaterThan(
                        repeatIndex,
                    );

                expect(exitIndex)
                    .toBeGreaterThan(
                        bodyIndex,
                    );

                const beforeExit =
                    code.slice(
                        0,
                        exitIndex,
                    );

                expect(
                    beforeExit,
                ).toContain(
                    'if compare("user", "admin", "equals"):',
                );

                expect(
                    beforeExit,
                ).toContain(
                    "for _ in range(3):",
                );

                expect(
                    beforeExit,
                ).toContain(
                    "inside_repeat",
                );
            },
        );
    },
);

describe(
    "generatePython Graph Edge Cases",
    () => {
        it(
            "generates an empty test body when graph has no start node",
            () => {
                const first =
                    createTapNode(
                        "tap-1",
                        "first",
                    );

                const second =
                    createTapNode(
                        "tap-2",
                        "second",
                    );

                const nodes = [
                    first,
                    second,
                ];

                const edges = [
                    createEdge(
                        "edge-1",
                        "tap-1",
                        "tap-2",
                    ),

                    createEdge(
                        "edge-2",
                        "tap-2",
                        "tap-1",
                    ),
                ];

                const code =
                    generatePython(
                        nodes,
                        { edges },
                    );

                expect(code).not.toContain(
                    "first",
                );

                expect(code).not.toContain(
                    "second",
                );

                expect(code).toContain(
                    "def test_generated():",
                );
            },
        );
    },
);