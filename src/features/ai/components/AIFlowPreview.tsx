import type { AIFlowPlan } from "../types/AIFlowPlan";

import { PlanDiffSummary } from "./PlanDiffSummary";

interface AIFlowPreviewProps {
    plan: AIFlowPlan;
    onApply?: () => void;
    onCancel?: () => void;
}

export function AIFlowPreview({
    plan,
    onApply,
    onCancel,
}: AIFlowPreviewProps) {
    return (
        <div
            style={{
                marginTop: 12,
                padding: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background:
                    "#161B22",
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color: "#E6EDF3",
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                AI Flow Plan
            </div>

            <div
                style={{
                    marginBottom: 12,
                    color: "#8B949E",
                    fontSize: 12,
                    lineHeight: 1.5,
                }}
            >
                {plan.summary}
            </div>

            <PlanDiffSummary
                source={{
                    kind: "flow",

                    plan,
                }}
            />

            {plan.warnings &&
                plan.warnings.length >
                0 && (
                    <div
                        style={{
                            marginBottom:
                                12,
                            padding: 10,
                            border:
                                "1px solid #9A6700",
                            borderRadius: 8,
                            background:
                                "#2D2100",
                            color:
                                "#D29922",
                            fontSize: 11,
                            lineHeight:
                                1.5,
                        }}
                    >
                        <strong>
                            Review before
                            applying
                        </strong>

                        <div
                            style={{
                                marginTop:
                                    4,
                            }}
                        >
                            {plan.warnings.map(
                                (
                                    warning,
                                ) => (
                                    <div
                                        key={
                                            warning
                                        }
                                    >
                                        {warning}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}

            <div
                style={{
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: 8,
                }}
            >
                {plan.steps.map(
                    (
                        step,
                        index,
                    ) => (
                        <div
                            key={
                                step.id
                            }
                            style={{
                                display:
                                    "flex",
                                gap: 10,
                                padding: 10,
                                border:
                                    "1px solid #30363D",
                                borderRadius:
                                    8,
                                background:
                                    "#0D1117",
                            }}
                        >
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    flexShrink: 0,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#21262D",
                                    color:
                                        "#8B949E",
                                    fontSize: 11,
                                    fontWeight:
                                        600,
                                }}
                            >
                                {index +
                                    1}
                            </div>

                            <div
                                style={{
                                    minWidth:
                                        0,
                                }}
                            >
                                <div
                                    style={{
                                        color:
                                            "#E6EDF3",
                                        fontSize:
                                            12,
                                        fontWeight:
                                            600,
                                    }}
                                >
                                    {
                                        step.title
                                    }
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            3,
                                        color:
                                            "#8B949E",
                                        fontSize:
                                            11,
                                        lineHeight:
                                            1.4,
                                    }}
                                >
                                    {
                                        step.description
                                    }
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            6,
                                        display:
                                            "flex",
                                        flexWrap:
                                            "wrap",
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            padding:
                                                "2px 6px",
                                            borderRadius:
                                                5,
                                            background:
                                                "#21262D",
                                            color:
                                                "#A371F7",
                                            fontSize:
                                                10,
                                        }}
                                    >
                                        {
                                            step.action
                                        }
                                    </span>

                                    {step.locator && (
                                        <span
                                            style={{
                                                maxWidth:
                                                    "100%",
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap",
                                                padding:
                                                    "2px 6px",
                                                borderRadius:
                                                    5,
                                                background:
                                                    "#21262D",
                                                color:
                                                    "#8B949E",
                                                fontSize:
                                                    10,
                                            }}
                                        >
                                            {
                                                step.locator
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ),
                )}
            </div>

            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "flex-end",
                    gap: 8,
                    marginTop: 12,
                }}
            >
                {onCancel && (
                    <button
                        type="button"
                        onClick={
                            onCancel
                        }
                        style={{
                            padding:
                                "7px 12px",
                            border:
                                "1px solid #30363D",
                            borderRadius:
                                7,
                            background:
                                "transparent",
                            color:
                                "#8B949E",
                            fontSize:
                                12,
                            cursor:
                                "pointer",
                        }}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="button"
                    onClick={onApply}
                    disabled={!onApply}
                    title="Apply AI plan to flow"
                    style={{
                        padding: "7px 12px",
                        border: "1px solid #238636",
                        borderRadius: 7,
                        background: "#238636",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: onApply
                            ? "pointer"
                            : "not-allowed",
                    }}
                >
                    Apply to Flow
                </button>
            </div>
        </div>
    );
}