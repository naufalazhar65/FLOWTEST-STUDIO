import {
    describe,
    expect,
    it,
} from "vitest";

import {
    loadFlowFixture,
} from "../utils/loadFlowFixture";

import type {
    FlowNode,
    LaunchAppNodeData,
} from "../../../src/features/flow/types/flowNode";

import {
    ExecutionController,
} from "../../../src/features/execution/services/ExecutionController";

import {
    useExecutionStore,
} from "../../../src/features/execution/store/useExecutionStore";

describe(
    "iOS simulator smoke test",
    () => {
        it(
            "executes the maintained iOS Sauce Labs flow",
            async () => {
                const project =
                    loadFlowFixture(
                        "iosTest.flow",
                    );

                expect(
                    project.nodes.length,
                ).toBeGreaterThan(0);

                expect(
                    project.edges.length,
                ).toBeGreaterThan(0);

                const launchNode =
                    project.nodes.find(
                        (
                            node,
                        ): node is FlowNode & {
                            data: LaunchAppNodeData;
                        } =>
                            node.data.action ===
                            "launchApp",
                    );

                expect(
                    launchNode,
                ).toBeDefined();

                if (
                    !launchNode
                ) {
                    throw new Error(
                        "Launch App node was not found in iOS smoke fixture.",
                    );
                }

                expect(
                    launchNode.data.platform,
                ).toBe("iOS");

                expect(
                    launchNode.data.bundleId,
                ).toBe(
                    "com.saucelabs.mydemo.app.ios",
                );

                await ExecutionController.run(
                    project.nodes,
                    {
                        edges:
                            project.edges,
                    },
                );

                const execution =
                    useExecutionStore.getState();

                expect(
                    execution.status,
                ).toBe("passed");

                expect(
                    execution.failedNodes,
                ).toBe(0);
            },
            120_000,
        );
    },
);