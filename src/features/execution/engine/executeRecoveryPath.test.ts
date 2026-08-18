import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    executeRecoveryPath,
} from "./executeRecoveryPath";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import * as executeNodeModule from "./executeNode";

describe(
    "executeRecoveryPath",
    () => {
        const context = {
            edges: [
                {
                    id: "1",
                    source: "A",
                    target: "B",
                },
                {
                    id: "2",
                    source: "B",
                    target: "C",
                },
            ],
        } as ExecutionContext;

        it(
            "executes every node in the recovery path in order",
            async () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,

                    {
                        id: "B",
                    } as FlowNode,

                    {
                        id: "C",
                    } as FlowNode,
                ];

                const executeNodeSpy =
                    vi
                        .spyOn(
                            executeNodeModule,
                            "executeNode",
                        )
                        .mockResolvedValue({
                            outputs: [
                                "next",
                            ],
                        });

                await executeRecoveryPath(
                    nodes,
                    context,
                );

                expect(
                    executeNodeSpy,
                ).toHaveBeenCalledTimes(
                    3,
                );

                expect(
                    executeNodeSpy
                        .mock
                        .calls
                        .map(
                            (
                                call,
                            ) =>
                                call[0]
                                    ?.id,
                        ),
                ).toEqual([
                    "A",
                    "B",
                    "C",
                ]);

                executeNodeSpy.mockRestore();
            },
        );

        it(
            "does nothing when the recovery path is empty",
            async () => {
                const executeNodeSpy =
                    vi
                        .spyOn(
                            executeNodeModule,
                            "executeNode",
                        )
                        .mockResolvedValue({
                            outputs: [
                                "next",
                            ],
                        });

                await executeRecoveryPath(
                    [],
                    context,
                );

                expect(
                    executeNodeSpy,
                ).not.toHaveBeenCalled();

                executeNodeSpy.mockRestore();
            },
        );

        it(
            "stops when a recovery node fails",
            async () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,

                    {
                        id: "B",
                    } as FlowNode,

                    {
                        id: "C",
                    } as FlowNode,
                ];

                const executeNodeSpy =
                    vi
                        .spyOn(
                            executeNodeModule,
                            "executeNode",
                        )
                        .mockImplementation(
                            async (
                                node,
                            ) => {
                                if (
                                    node.id ===
                                    "B"
                                ) {
                                    throw new Error(
                                        "Recovery failed",
                                    );
                                }

                                return {
                                    outputs: [
                                        "next",
                                    ],
                                };
                            },
                        );

                await expect(
                    executeRecoveryPath(
                        nodes,
                        context,
                    ),
                ).rejects.toThrow(
                    "Recovery failed",
                );

                expect(
                    executeNodeSpy
                        .mock
                        .calls
                        .map(
                            (
                                call,
                            ) =>
                                call[0]
                                    ?.id,
                        ),
                ).toEqual([
                    "A",
                    "B",
                ]);

                executeNodeSpy.mockRestore();
            },
        );
    },
);