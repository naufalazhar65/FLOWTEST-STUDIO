import {
    describe,
    expect,
    it,
} from "vitest";

import type {
    FlowNode,
    LaunchAppNodeData,
} from "../../../src/features/flow/types/flowNode";

import {
    loadFlowProjectFile,
} from "../utils/loadFlowProjectFile";

import {
    ExecutionController,
} from "../../../src/features/execution/services/ExecutionController";

import {
    useExecutionStore,
} from "../../../src/features/execution/store/useExecutionStore";

import {
    exportHeadlessArtifacts,
} from "./exportHeadlessArtifacts";

const flowPath =
    process.env.FLOWTEST_FLOW;

describe(
    "FlowTest Studio headless execution",
    () => {
        it(
            "executes the selected flow successfully",
            async () => {
                if (!flowPath) {
                    throw new Error(
                        "FLOWTEST_FLOW environment variable is required.",
                    );
                }

                const project =
                    await loadFlowProjectFile(
                        flowPath,
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
                            node.data
                                .action ===
                            "launchApp",
                    );

                expect(
                    launchNode,
                ).toBeDefined();

                if (
                    !launchNode
                ) {
                    throw new Error(
                        "Flow does not contain a Launch App node.",
                    );
                }

                console.info(
                    `[Headless] Flow: ${project.name}`,
                );

                console.info(
                    `[Headless] Platform: ${launchNode.data.platform}`,
                );

                console.info(
                    `[Headless] Nodes: ${project.nodes.length}`,
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

                console.info(
                    `[Headless] Execution passed: ${project.name}`,
                );

                const artifactDirectory =
                    process.env.FLOWTEST_ARTIFACT_DIR ??
                    "artifacts/execution";

                await exportHeadlessArtifacts({
                    outputDirectory:
                        artifactDirectory,
                });

                console.info(
                    `[Headless] Execution artifacts written to: ${artifactDirectory}`,
                );
            },
            120_000,
        );
    },
);