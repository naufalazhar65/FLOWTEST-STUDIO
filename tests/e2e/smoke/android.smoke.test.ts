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
    "Android real-device smoke test",
    () => {
        it(
            "executes the maintained Android Sauce Labs flow",
            async () => {
                const project =
                    loadFlowFixture(
                        "androidTest.flow",
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
                        "Launch App node was not found in Android smoke fixture.",
                    );
                }

                expect(
                    launchNode.data.platform,
                ).toBe("Android");

                expect(
                    launchNode.data.appPackage,
                ).toBe(
                    "com.saucelabs.mydemoapp.android",
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