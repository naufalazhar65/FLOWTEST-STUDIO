import { useState } from "react";

import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import {
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../../themes";

import type { ExecutionLog } from "../store/useExecutionLogStore";

import { Badge } from "../../../components/ui/Badge";

import {
    getExecutionNodeTheme,
} from "../theme/executionNodeTheme";

import {
    formatLogLabel,
} from "../utils/formatLogLabel";

interface Props {
    log: ExecutionLog;
}

export function TimelineItem({
    log,
}: Props) {
    const [expanded, setExpanded] =
        useState(false);

    const hasDetails =
        !!log.details &&
        Object.keys(log.details)
            .length > 0;

    const theme =
        getExecutionNodeTheme(
            log.nodeType,
        );

    const Icon = theme.icon;

    return (
        <article
            onClick={() => {
                if (hasDetails) {
                    setExpanded(
                        (value) =>
                            !value,
                    );
                }
            }}
            style={{
                display: "flex",

                gap: spacing.md,

                padding: spacing.md,

                borderRadius:
                    radius.md,

                border:
                    `1px solid ${colors.border}`,

                borderLeft:
                    `3px solid ${theme.color}`,

                background:
                    colors.background,

                boxShadow:
                    expanded
                        ? shadow.card
                        : undefined,

                cursor: hasDetails
                    ? "pointer"
                    : "default",

                transition:
                    "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
            }}
        >
            {/* Time */}
            <div
                style={{
                    width: 68,

                    flexShrink: 0,

                    paddingTop: 2,

                    color:
                        colors.textMuted,

                    fontSize:
                        typography.tiny
                            .fontSize,

                    lineHeight: 1.4,

                    fontVariantNumeric:
                        "tabular-nums",
                }}
            >
                {new Date(
                    log.timestamp,
                ).toLocaleTimeString()}
            </div>

            {/* Expand Icon */}
            <div
                style={{
                    width: 18,

                    flexShrink: 0,

                    display: "flex",

                    alignItems:
                        "flex-start",

                    justifyContent:
                        "center",

                    paddingTop: 2,

                    color:
                        colors.textMuted,
                }}
            >
                {hasDetails ? (
                    expanded ? (
                        <ChevronDown
                            size={14}
                        />
                    ) : (
                        <ChevronRight
                            size={14}
                        />
                    )
                ) : null}
            </div>

            {/* Badge */}
            {log.nodeType && (
                <div
                    style={{
                        flexShrink: 0,
                    }}
                >
                    <Badge
                        color={
                            theme.color
                        }
                        style={{
                            minHeight: 22,

                            padding:
                                "3px 8px",

                            fontSize:
                                typography.tiny
                                    .fontSize,
                        }}
                    >
                        {log.nodeType.toUpperCase()}
                    </Badge>
                </div>
            )}

            {/* Content */}
            <div
                style={{
                    flex: 1,

                    minWidth: 0,
                }}
            >
                {/* Message */}
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: spacing.sm,
                    }}
                >
                    <span
                        style={{
                            width: 24,

                            height: 24,

                            flexShrink: 0,

                            display:
                                "inline-flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            borderRadius:
                                radius.sm,

                            background:
                                `${theme.color}12`,

                            color:
                                theme.color,
                        }}
                    >
                        <Icon
                            size={15}
                        />
                    </span>

                    <div
                        style={{
                            minWidth: 0,

                            color:
                                colors.text,

                            fontSize:
                                typography.body
                                    .fontSize,

                            fontWeight:
                                typography.body
                                    .fontWeight,

                            lineHeight:
                                1.4,

                            overflow:
                                "hidden",

                            textOverflow:
                                "ellipsis",

                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {log.message}
                    </div>
                </div>

                {/* Node Title */}
                {log.nodeTitle && (
                    <div
                        style={{
                            marginTop:
                                spacing.xs,

                            color:
                                colors.textSecondary,

                            fontSize:
                                typography.tiny
                                    .fontSize,

                            lineHeight:
                                1.4,

                            overflow:
                                "hidden",

                            textOverflow:
                                "ellipsis",

                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {log.nodeTitle}
                    </div>
                )}

                {/* Duration */}
                {log.duration !==
                    undefined && (
                        <div
                            style={{
                                marginTop:
                                    spacing.xs,

                                color:
                                    colors.textMuted,

                                fontSize:
                                    typography.tiny
                                        .fontSize,

                                fontVariantNumeric:
                                    "tabular-nums",
                            }}
                        >
                            {Math.round(
                                log.duration,
                            )}{" "}
                            ms
                        </div>
                    )}

                {/* Details */}
                {expanded &&
                    hasDetails && (
                        <div
                            style={{
                                marginTop:
                                    spacing.md,

                                padding:
                                    spacing.md,

                                borderRadius:
                                    radius.md,

                                background:
                                    colors.panel,

                                border:
                                    `1px solid ${colors.border}`,

                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap: spacing.sm,

                                boxShadow:
                                    shadow.card,
                            }}
                        >
                            {Object.entries(
                                log.details!,
                            ).map(
                                ([
                                    key,
                                    value,
                                ]) => (
                                    <div
                                        key={
                                            key
                                        }
                                        style={{
                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                "120px minmax(0, 1fr)",

                                            gap: spacing.md,

                                            alignItems:
                                                "start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color:
                                                    colors.textMuted,

                                                fontSize:
                                                    typography.tiny
                                                        .fontSize,

                                                fontWeight:
                                                    typography.caption
                                                        .fontWeight,

                                                lineHeight:
                                                    1.4,
                                            }}
                                        >
                                            {formatLogLabel(
                                                key,
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                minWidth:
                                                    0,

                                                color:
                                                    colors.text,

                                                fontSize:
                                                    typography.tiny
                                                        .fontSize,

                                                lineHeight:
                                                    1.5,

                                                wordBreak:
                                                    "break-word",
                                            }}
                                        >
                                            {String(
                                                value,
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
            </div>
        </article>
    );
}