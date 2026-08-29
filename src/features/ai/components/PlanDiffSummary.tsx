import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    computePlanDiff,
} from "../services/flowPlanDiff";

import type {
    PlanDiffSource,
    PlanDiff,
} from "../services/flowPlanDiff";

interface PlanDiffSummaryProps {
    source: PlanDiffSource;
}

export function PlanDiffSummary({
    source,
}: PlanDiffSummaryProps) {
    const nodes =
        useFlowStore(
            (state) =>
                state.nodes,
        );

    const edges =
        useFlowStore(
            (state) =>
                state.edges,
        );

    const diff: PlanDiff =
        computePlanDiff(
            source,
            nodes,
            edges,
        );

    const {
        summary,
    } = diff;

    const totalChange =
        summary.addedNodes +
        summary.modifiedNodes +
        summary.removedNodes;

    if (totalChange === 0) {
        return null;
    }

    const columns: {
        value: number;

        label: string;

        color: string;
    }[] = [];

    if (
        summary.addedNodes > 0
    ) {
        columns.push({
            value:
                summary.addedNodes,

            label: "new node",

            color: "#3FB950",
        });
    }

    if (
        summary.modifiedNodes > 0
    ) {
        columns.push({
            value:
                summary.modifiedNodes,

            label: "modified",

            color: "#D29922",
        });
    }

    if (
        summary.removedNodes > 0
    ) {
        columns.push({
            value:
                summary.removedNodes,

            label: "removed",

            color: "#F85149",
        });
    }

    return (
        <div
            style={{
                marginBottom: 12,
                padding: 10,
                border:
                    "1px solid #30363D",
                borderRadius: 8,
                background:
                    "#0D1117",
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color:
                        "#8B949E",
                    fontSize: 10,
                    textTransform:
                        "uppercase",
                    letterSpacing:
                        "0.04em",
                    fontWeight: 600,
                }}
            >
                Changes this will
                make
            </div>

            <div
                style={{
                    display:
                        "flex",
                    gap: 16,
                    flexWrap:
                        "wrap",
                }}
            >
                {columns.map(
                    (
                        column,
                    ) => (
                        <div
                            key={
                                column.label
                            }
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "baseline",
                                gap: 6,
                            }}
                        >
                            <span
                                style={{
                                    color:
                                        column.color,
                                    fontSize: 20,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                }}
                            >
                                {
                                    column.value
                                }
                            </span>

                            <span
                                style={{
                                    color:
                                        "#8B949E",
                                    fontSize: 11,
                                }}
                            >
                                {
                                    column.label
                                }
                                {
                                    column.value ===
                                        1
                                        ? ""
                                        : "s"
                                }
                            </span>
                        </div>
                    ),
                )}

                {summary.addedEdges >
                    0 && (
                    <span
                        style={{
                            color:
                                "#3FB950",
                            fontSize: 11,
                        }}
                    >
                        +{" "}
                        {
                            summary.addedEdges
                        }{" "}
                        edge
                        {
                            summary.addedEdges ===
                                1
                                ? ""
                                : "s"
                        }
                    </span>
                )}

                {summary.removedEdges >
                    0 && (
                    <span
                        style={{
                            color:
                                "#F85149",
                            fontSize: 11,
                        }}
                    >
                        −{" "}
                        {
                            summary.removedEdges
                        }{" "}
                        edge
                        {
                            summary.removedEdges ===
                                1
                                ? ""
                                : "s"
                        }
                    </span>
                )}
            </div>
        </div>
    );
}
