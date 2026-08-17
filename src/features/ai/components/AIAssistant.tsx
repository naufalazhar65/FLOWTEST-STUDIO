import {
    useState,
} from "react";

import {
    CheckCircle2,
    Sparkles,
    X,
} from "lucide-react";

import {
    useAIStore,
} from "../store/useAIStore";

import {
    applyAIFlowPlan,
} from "../services/applyAIFlowPlan";

import {
    applyAIModificationPlan,
} from "../services/applyAIModificationPlan";

import {
    applyResolvedAILocatorsToFlow,
} from "../services/applyResolvedAILocatorsToFlow";

import {
    AIChat,
} from "./AIChat";

import {
    AITestCasePreview,
} from "./AITestCasePreview";

import {
    ExecutionController,
} from "../../execution/services/ExecutionController";

import {
    launchAppRunner,
} from "../../execution/runners/LaunchAppRunner";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import type {
    FlowNode,
    LaunchAppNodeData,
} from "../../flow/types/flowNode";

interface AIAssistantProps {
    onClose?: () => void;
}

type StatusTone =
    | "success"
    | "error"
    | "info";

function isLaunchAppNode(
    node: FlowNode,
): node is FlowNode & {
    data: LaunchAppNodeData;
} {
    return (
        node.data.action ===
        "launchApp"
    );
}

export function AIAssistant({
    onClose,
}: AIAssistantProps) {
    const [
        applyResult,
        setApplyResult,
    ] = useState<
        string | null
    >(null);

    const [
        statusTone,
        setStatusTone,
    ] = useState<StatusTone>(
        "success",
    );

    const [
        isGenerating,
        setIsGenerating,
    ] = useState(false);

    const [
        isLaunchingApp,
        setIsLaunchingApp,
    ] = useState(false);

    const [
        isResolvingLocators,
        setIsResolvingLocators,
    ] = useState(false);

    const [
        isRunningGeneratedFlow,
        setIsRunningGeneratedFlow,
    ] = useState(false);

    const [
        generatedFlowReady,
        setGeneratedFlowReady,
    ] = useState(false);

    const [
        generatedNodeIds,
        setGeneratedNodeIds,
    ] = useState<Set<string>>(
        new Set(),
    );

    const [
        requirement,
        setRequirement,
    ] = useState("");

    const draftPlan =
        useAIStore(
            (state) =>
                state.draftPlan,
        );

    const draftModificationPlan =
        useAIStore(
            (state) =>
                state.draftModificationPlan,
        );

    const draftTestCases =
        useAIStore(
            (state) =>
                state.draftTestCases,
        );

    const storeIsGenerating =
        useAIStore(
            (state) =>
                state.isGenerating,
        );

    const error =
        useAIStore(
            (state) =>
                state.error,
        );

    const setDraftPlan =
        useAIStore(
            (state) =>
                state.setDraftPlan,
        );

    const setDraftModificationPlan =
        useAIStore(
            (state) =>
                state.setDraftModificationPlan,
        );

    const setDraftTestCases =
        useAIStore(
            (state) =>
                state.setDraftTestCases,
        );

    const convertTestCaseToFlow =
        useAIStore(
            (state) =>
                state.convertTestCaseToFlow,
        );

    const generateTestCases =
        useAIStore(
            (state) =>
                state.generateTestCases,
        );

    const addMessage =
        useAIStore(
            (state) =>
                state.addMessage,
        );

    function setStatus(
        message:
            string | null,
        tone:
            StatusTone = "success",
    ) {
        setApplyResult(
            message,
        );

        setStatusTone(
            tone,
        );
    }

    async function handleGenerateTestCases() {
        const value =
            requirement.trim();

        if (!value) {
            return;
        }

        setStatus(
            null,
        );

        setGeneratedFlowReady(
            false,
        );

        setIsGenerating(
            true,
        );

        try {
            await generateTestCases(
                value,
            );
        } catch {
            /*
             * The store exposes the
             * normalized error.
             */
        } finally {
            setIsGenerating(
                false,
            );
        }
    }

    async function handleApproveTestCases() {
        if (
            !draftTestCases ||
            draftTestCases.length ===
            0
        ) {
            return;
        }

        const testCase =
            draftTestCases[0];

        setStatus(
            null,
        );

        setGeneratedFlowReady(
            false,
        );

        try {
            await convertTestCaseToFlow(
                testCase,
            );
        } catch {
            /*
             * The store exposes the
             * normalized error.
             */
        }
    }

    function handleApply() {
        if (
            draftModificationPlan
        ) {
            const result =
                applyAIModificationPlan(
                    draftModificationPlan,
                );

            if (
                !result.success
            ) {
                setStatus(
                    result.error ??
                    "Failed to apply AI modification.",
                    "error",
                );

                return;
            }

            setStatus(
                `Applied ${result.appliedSteps} modification${result.appliedSteps ===
                    1
                    ? ""
                    : "s"
                } to the current flow.`,
                "success",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    `Done. I applied ${result.appliedSteps} modification${result.appliedSteps ===
                        1
                        ? ""
                        : "s"
                    } to the current flow.`,

                createdAt:
                    Date.now(),
            });

            setDraftModificationPlan(
                null,
            );

            return;
        }

        if (!draftPlan) {
            return;
        }

        const result =
            applyAIFlowPlan(
                draftPlan,
            );
        setGeneratedNodeIds(
            new Set(
                result.nodeIds,
            ),
        );

        if (
            !result.success
        ) {
            setStatus(
                result.error ??
                "Failed to apply AI flow.",
                "error",
            );

            return;
        }

        setStatus(
            `Applied ${result.appliedSteps} step${result.appliedSteps ===
                1
                ? ""
                : "s"
            } to the current flow.`,
            "success",
        );

        addMessage({
            id:
                crypto.randomUUID(),

            role:
                "assistant",

            content:
                `Done. I added ${result.appliedSteps} step${result.appliedSteps ===
                    1
                    ? ""
                    : "s"
                } to the current flow.`,

            createdAt:
                Date.now(),
        });

        setGeneratedFlowReady(
            true,
        );

        setDraftPlan(
            null,
        );
    }

    async function handleRunGeneratedFlow() {
        if (
            !generatedFlowReady ||
            isRunningGeneratedFlow ||
            isLaunchingApp ||
            isResolvingLocators
        ) {
            return;
        }

        const initialFlow =
            useFlowStore.getState();

        const launchAppNodes =
            initialFlow.nodes.filter(
                isLaunchAppNode,
            );

        if (
            launchAppNodes.length ===
            0
        ) {
            setStatus(
                "No Launch App node is configured in the current flow. Add a Launch App node before running the generated flow.",
                "error",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    "The generated flow cannot run yet because the current flow has no Launch App node. Add and configure a Launch App node first.",

                createdAt:
                    Date.now(),
            });

            return;
        }

        const launchAppNodeIds =
            new Set(
                launchAppNodes.map(
                    (node) =>
                        node.id,
                ),
            );

        /*
         * ------------------------------------------
         * 1. Launch App
         * ------------------------------------------
         */
        setIsLaunchingApp(
            true,
        );

        setStatus(
            "Launching the application...",
            "info",
        );

        try {
            for (
                const node of
                launchAppNodes
            ) {
                await launchAppRunner.run(
                    node,
                    {
                        edges:
                            initialFlow.edges,
                    },
                );
            }
        } catch (
        error
        ) {
            const message =
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    );

            setStatus(
                `Failed to launch the application: ${message}`,
                "error",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    `I could not launch the application: ${message}`,

                createdAt:
                    Date.now(),
            });

            return;
        } finally {
            setIsLaunchingApp(
                false,
            );
        }

        /*
         * ------------------------------------------
         * 2. Resolve Locators
         * ------------------------------------------
         */
        setIsResolvingLocators(
            true,
        );

        setStatus(
            "Resolving locators from the active Appium application...",
            "info",
        );

        try {
            const locatorResult =
                await applyResolvedAILocatorsToFlow(
                    generatedNodeIds,
                );

            if (
                !locatorResult.success
            ) {
                const unresolved =
                    locatorResult.results
                        .filter(
                            (
                                result,
                            ) =>
                                result.status !==
                                "resolved",
                        )
                        .map(
                            (
                                result,
                            ) =>
                                `${result.target}: ${result.status}`,
                        );

                const message =
                    unresolved.length >
                        0
                        ? `Unable to resolve ${unresolved.length} locator${unresolved.length ===
                            1
                            ? ""
                            : "s"
                        }: ${unresolved.join(
                            ", ",
                        )}.`
                        : "Unable to resolve the generated flow locators.";

                setStatus(
                    message,
                    "error",
                );

                addMessage({
                    id:
                        crypto.randomUUID(),

                    role:
                        "assistant",

                    content:
                        message,

                    createdAt:
                        Date.now(),
                });

                return;
            }

            setStatus(
                `Resolved ${locatorResult.resolved} locator${locatorResult.resolved ===
                    1
                    ? ""
                    : "s"
                }. Starting flow execution...`,
                "info",
            );
        } catch (
        error
        ) {
            const message =
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    );

            setStatus(
                `Locator resolution failed: ${message}`,
                "error",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    `I could not resolve the generated flow locators: ${message}`,

                createdAt:
                    Date.now(),
            });

            return;
        } finally {
            setIsResolvingLocators(
                false,
            );
        }

        /*
         * ------------------------------------------
         * 3. Read latest flow
         * ------------------------------------------
         */
        const latestFlow =
            useFlowStore.getState();

        const latestNodes =
            latestFlow.nodes;

        const latestEdges =
            latestFlow.edges;

        if (
            latestNodes.length ===
            0
        ) {
            setStatus(
                "No generated flow is available to execute.",
                "error",
            );

            return;
        }

        /*
         * ------------------------------------------
         * 4. Execute
         * ------------------------------------------
         */
        setIsRunningGeneratedFlow(
            true,
        );

        setStatus(
            "Running the generated flow...",
            "info",
        );

        try {
            await ExecutionController.run(
                latestNodes,
                {
                    edges:
                        latestEdges,
                },
                {
                    reuseExistingAppiumSession:
                        true,

                    skipNodeIds:
                        launchAppNodeIds,
                },
            );

            setStatus(
                "Generated flow executed successfully.",
                "success",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    "Done. The generated flow launched the application, resolved its locators, and executed successfully.",

                createdAt:
                    Date.now(),
            });
        } catch (
        error
        ) {
            const message =
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    );

            setStatus(
                `Generated flow execution failed: ${message}`,
                "error",
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    `The generated flow failed during execution: ${message}`,

                createdAt:
                    Date.now(),
            });
        } finally {
            setIsRunningGeneratedFlow(
                false,
            );
        }
    }

    function handleCancel() {
        setDraftPlan(
            null,
        );

        setDraftModificationPlan(
            null,
        );

        setDraftTestCases(
            null,
        );

        setRequirement(
            "",
        );

        setStatus(
            null,
        );

        setGeneratedFlowReady(
            false,
        );
    }

    const busy =
        isGenerating ||
        storeIsGenerating ||
        isLaunchingApp ||
        isResolvingLocators ||
        isRunningGeneratedFlow;

    const statusStyles =
        statusTone ===
            "error"
            ? {
                border:
                    "1px solid #F85149",

                background:
                    "rgba(248,81,73,.10)",

                color:
                    "#FF7B72",
            }
            : statusTone ===
                "info"
                ? {
                    border:
                        "1px solid #388BFD",

                    background:
                        "rgba(56,139,253,.10)",

                    color:
                        "#58A6FF",
                }
                : {
                    border:
                        "1px solid #238636",

                    background:
                        "rgba(35,134,54,.12)",

                    color:
                        "#3FB950",
                };

    return (
        <section
            style={{
                width:
                    "100%",

                height:
                    "100%",

                minHeight:
                    0,

                display:
                    "flex",

                flexDirection:
                    "column",

                background:
                    "#0D1117",

                color:
                    "#E6EDF3",
            }}
        >
            <header
                style={{
                    height:
                        56,

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "0 14px",

                    borderBottom:
                        "1px solid #30363D",
                }}
            >
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            8,
                    }}
                >
                    <Sparkles
                        size={
                            16
                        }
                        color="#A371F7"
                    />

                    <span
                        style={{
                            fontSize:
                                14,

                            fontWeight:
                                600,
                        }}
                    >
                        AI Assistant
                    </span>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        aria-label="Close AI Assistant"
                        style={{
                            width:
                                30,

                            height:
                                30,

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            border:
                                "none",

                            borderRadius:
                                6,

                            background:
                                "transparent",

                            color:
                                "#8B949E",

                            cursor:
                                "pointer",
                        }}
                    >
                        <X
                            size={
                                16
                            }
                        />
                    </button>
                )}
            </header>

            <div
                style={{
                    flex:
                        1,

                    minHeight:
                        0,

                    overflowY:
                        "auto",

                    display:
                        "flex",

                    flexDirection:
                        "column",

                    padding:
                        "12px",
                }}
            >
                <div
                    style={{
                        flexShrink:
                            0,

                        marginBottom:
                            12,
                    }}
                >
                    <div
                        style={{
                            marginBottom:
                                7,

                            color:
                                "#E6EDF3",

                            fontSize:
                                12,

                            fontWeight:
                                600,
                        }}
                    >
                        Generate Test Cases
                    </div>

                    <textarea
                        value={
                            requirement
                        }
                        onChange={
                            (
                                event,
                            ) =>
                                setRequirement(
                                    event
                                        .target
                                        .value,
                                )
                        }
                        disabled={
                            busy
                        }
                        rows={
                            4
                        }
                        placeholder="Describe the test requirement..."
                        style={{
                            width:
                                "100%",

                            boxSizing:
                                "border-box",

                            resize:
                                "vertical",

                            padding:
                                "9px 10px",

                            border:
                                "1px solid #30363D",

                            borderRadius:
                                8,

                            background:
                                "#161B22",

                            color:
                                "#E6EDF3",

                            outline:
                                "none",

                            fontSize:
                                12,

                            lineHeight:
                                1.5,
                        }}
                    />

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "flex-end",

                            marginTop:
                                8,
                        }}
                    >
                        <button
                            type="button"
                            onClick={
                                handleGenerateTestCases
                            }
                            disabled={
                                busy ||
                                !requirement.trim()
                            }
                            style={{
                                padding:
                                    "8px 12px",

                                border:
                                    "1px solid #8957E5",

                                borderRadius:
                                    7,

                                background:
                                    "#8957E5",

                                color:
                                    "#FFFFFF",

                                fontSize:
                                    12,

                                fontWeight:
                                    600,

                                cursor:
                                    busy ||
                                        !requirement.trim()
                                        ? "not-allowed"
                                        : "pointer",

                                opacity:
                                    busy ||
                                        !requirement.trim()
                                        ? 0.6
                                        : 1,
                            }}
                        >
                            {isGenerating ||
                                storeIsGenerating
                                ? "Generating..."
                                : "Generate Test Cases"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            marginBottom:
                                12,

                            padding:
                                "9px 10px",

                            border:
                                "1px solid #F85149",

                            borderRadius:
                                8,

                            background:
                                "rgba(248,81,73,.10)",

                            color:
                                "#FF7B72",

                            fontSize:
                                11,

                            lineHeight:
                                1.4,
                        }}
                    >
                        {error}
                    </div>
                )}

                {draftTestCases &&
                    draftTestCases.length >
                    0 && (
                        <div
                            style={{
                                marginBottom:
                                    12,
                            }}
                        >
                            <AITestCasePreview
                                testCases={
                                    draftTestCases
                                }

                                onApprove={
                                    handleApproveTestCases
                                }

                                onCancel={
                                    handleCancel
                                }
                            />
                        </div>
                    )}

                <AIChat
                    draftPlan={
                        draftPlan
                    }

                    draftModificationPlan={
                        draftModificationPlan
                    }

                    onApply={
                        handleApply
                    }

                    onCancel={
                        handleCancel
                    }
                />

                {generatedFlowReady && (
                    <div
                        style={{
                            marginTop:
                                12,

                            paddingTop:
                                12,

                            borderTop:
                                "1px solid #30363D",
                        }}
                    >
                        <button
                            type="button"
                            onClick={
                                handleRunGeneratedFlow
                            }
                            disabled={
                                busy
                            }
                            style={{
                                width:
                                    "100%",

                                padding:
                                    "9px 12px",

                                border:
                                    "1px solid #238636",

                                borderRadius:
                                    7,

                                background:
                                    busy
                                        ? "#1f6f32"
                                        : "#238636",

                                color:
                                    "#FFFFFF",

                                fontSize:
                                    12,

                                fontWeight:
                                    600,

                                cursor:
                                    busy
                                        ? "default"
                                        : "pointer",

                                opacity:
                                    busy
                                        ? 0.7
                                        : 1,
                            }}
                        >
                            {isLaunchingApp
                                ? "Launching App..."
                                : isResolvingLocators
                                    ? "Resolving Locators..."
                                    : isRunningGeneratedFlow
                                        ? "Running..."
                                        : "Run Generated Flow"}
                        </button>
                    </div>
                )}

                {applyResult && (
                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "flex-start",

                            gap:
                                7,

                            marginTop:
                                10,

                            padding:
                                "9px 10px",

                            border:
                                statusStyles.border,

                            borderRadius:
                                8,

                            background:
                                statusStyles.background,

                            color:
                                statusStyles.color,

                            fontSize:
                                11,

                            lineHeight:
                                1.4,
                        }}
                    >
                        <CheckCircle2
                            size={
                                14
                            }
                        />

                        <span>
                            {
                                applyResult
                            }
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}