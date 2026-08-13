import {
    CheckCircle2,
    Layers3,
} from "lucide-react";

import type { TestSuite } from "../types/TestSuite";

import {
    colors,
    radius,
    spacing,
    typography,
    animation,
} from "../../../themes";

interface Props {
    suite: TestSuite;

    selected?: boolean;

    onClick?(): void;
}

export function TestSuiteCard({
    suite,
    selected = false,
    onClick,
}: Props) {
    const enabledCount =
        suite.testCases.filter(
            (test) => test.enabled,
        ).length;

    const hasDescription =
        suite.description.trim().length >
        0;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            style={{
                width: "100%",

                display: "flex",

                alignItems:
                    "flex-start",

                gap: spacing.sm,

                padding:
                    `${spacing.sm + 1}px ${spacing.sm}px`,

                border:
                    `1px solid ${selected
                        ? colors.accent
                        : colors.border
                    }`,

                borderRadius:
                    radius.md,

                background:
                    selected
                        ? colors.panelHover
                        : "transparent",

                color:
                    colors.text,

                cursor:
                    "pointer",

                textAlign: "left",

                transition:
                    `background ${animation.fast}, border-color ${animation.fast}`,

                boxSizing:
                    "border-box",

                outline: "none",
            }}
            onMouseEnter={(event) => {
                if (!selected) {
                    event.currentTarget.style
                        .background =
                        colors.panelHover;
                }
            }}
            onMouseLeave={(event) => {
                if (!selected) {
                    event.currentTarget.style
                        .background =
                        "transparent";
                }
            }}
            onFocus={(event) => {
                event.currentTarget.style
                    .borderColor =
                    colors.focus;

                event.currentTarget.style
                    .boxShadow =
                    `0 0 0 2px ${colors.selection}`;
            }}
            onBlur={(event) => {
                event.currentTarget.style
                    .borderColor =
                    selected
                        ? colors.accent
                        : colors.border;

                event.currentTarget.style
                    .boxShadow =
                    "none";
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 28,

                    height: 28,

                    flexShrink: 0,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    borderRadius:
                        radius.sm,

                    background:
                        selected
                            ? colors.accent
                            : colors.background,

                    color:
                        selected
                            ? "#FFFFFF"
                            : colors.textSecondary,

                    transition:
                        `background ${animation.fast}, color ${animation.fast}`,
                }}
            >
                <Layers3
                    size={14}
                    strokeWidth={1.8}
                />
            </div>

            {/* Content */}
            <div
                style={{
                    minWidth: 0,

                    flex: 1,
                }}
            >
                {/* Name */}
                <div
                    style={{
                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",

                        color:
                            colors.text,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.subtitle
                                .fontWeight,

                        lineHeight: 1.3,
                    }}
                >
                    {suite.name}
                </div>

                {/* Description */}
                {hasDescription && (
                    <div
                        style={{
                            marginTop:
                                spacing.xs,

                            overflow:
                                "hidden",

                            textOverflow:
                                "ellipsis",

                            whiteSpace:
                                "nowrap",

                            color:
                                colors.textSecondary,

                            fontSize:
                                typography.tiny
                                    .fontSize,

                            fontWeight:
                                typography.tiny
                                    .fontWeight,

                            lineHeight: 1.4,
                        }}
                        title={
                            suite.description
                        }
                    >
                        {suite.description}
                    </div>
                )}

                {/* Test count */}
                <div
                    style={{
                        marginTop:
                            spacing.xs,

                        color:
                            colors.textMuted,

                        fontSize:
                            typography.tiny
                                .fontSize,

                        lineHeight: 1.3,
                    }}
                >
                    {suite.testCases.length}{" "}
                    {suite.testCases.length ===
                        1
                        ? "test"
                        : "tests"}
                </div>

                {/* Enabled count */}
                {enabledCount > 0 && (
                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: spacing.xs,

                            marginTop:
                                spacing.xs,

                            color:
                                colors.success,

                            fontSize:
                                typography.tiny
                                    .fontSize,

                            lineHeight:
                                1.3,
                        }}
                    >
                        <CheckCircle2
                            size={11}
                        />

                        {enabledCount}{" "}
                        enabled
                    </div>
                )}
            </div>
        </button>
    );
}