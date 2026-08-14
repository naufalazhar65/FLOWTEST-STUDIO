import { useState } from "react";

import {
    ChevronDown,
    ChevronRight,
    Download,
    ExternalLink,
    Image as ImageIcon,
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

import { useExecutionStore } from "../store/useExecutionStore";

interface Props {
    log: ExecutionLog;
}

function normalizeScreenshotFileName(
    fileName?: string,
): string {
    const fallback =
        "screenshot.png";

    const value =
        fileName?.trim();

    if (!value) {
        return fallback;
    }

    return value.toLowerCase().endsWith(".png")
        ? value
        : `${value}.png`;
}

function getScreenshotSrc(
    screenshot?: string,
): string | null {
    if (!screenshot) {
        return null;
    }

    if (
        screenshot.startsWith(
            "data:image/",
        )
    ) {
        return screenshot;
    }

    return `data:image/png;base64,${screenshot}`;
}

function downloadScreenshot(
    screenshot: string,
    fileName: string,
) {
    const source =
        getScreenshotSrc(
            screenshot,
        );

    if (!source) {
        return;
    }

    const link =
        document.createElement("a");

    link.href = source;

    link.download =
        normalizeScreenshotFileName(
            fileName,
        );

    document.body.appendChild(
        link,
    );

    link.click();

    document.body.removeChild(
        link,
    );
}

function openScreenshot(
    screenshot: string,
) {
    const source =
        getScreenshotSrc(
            screenshot,
        );

    if (!source) {
        return;
    }

    const imageWindow =
        window.open(
            "",
            "_blank",
        );

    if (!imageWindow) {
        return;
    }

    imageWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Screenshot</title>
                <style>
                    html,
                    body {
                        margin: 0;
                        padding: 0;
                        background: #0D1117;
                        min-height: 100%;
                    }

                    body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 24px;
                        box-sizing: border-box;
                    }

                    img {
                        display: block;
                        max-width: 100%;
                        max-height: calc(100vh - 48px);
                        object-fit: contain;
                        border-radius: 8px;
                        box-shadow:
                            0 20px 60px
                            rgba(0, 0, 0, 0.45);
                    }
                </style>
            </head>

            <body>
                <img
                    src="${source}"
                    alt="Execution screenshot"
                />
            </body>
        </html>
    `);

    imageWindow.document.close();
}

export function TimelineItem({
    log,
}: Props) {
    const [expanded, setExpanded] =
        useState(false);

    const nodeResults =
        useExecutionStore(
            (state) =>
                state.nodeResults,
        );

    const nodeResult =
        log.nodeId
            ? nodeResults[
            log.nodeId
            ]
            : undefined;

    const screenshot =
        nodeResult?.screenshot;

    const screenshotFileName =
        normalizeScreenshotFileName(
            nodeResult?.screenshotFileName,
        );

    const screenshotSrc =
        getScreenshotSrc(
            screenshot,
        );

    const hasScreenshot =
        !!screenshotSrc;

    const hasDetails =
        !!log.details &&
        Object.keys(
            log.details,
        ).length > 0;

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

                cursor:
                    hasDetails
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
                                typography
                                    .tiny
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
                        display: "flex",

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
                                typography
                                    .body
                                    .fontSize,

                            fontWeight:
                                typography
                                    .body
                                    .fontWeight,

                            lineHeight: 1.4,

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
                                colors
                                    .textSecondary,

                            fontSize:
                                typography
                                    .tiny
                                    .fontSize,

                            lineHeight: 1.4,

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
                                    colors
                                        .textMuted,

                                fontSize:
                                    typography
                                        .tiny
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

                {/* Screenshot */}

                {hasScreenshot && (
                    <div
                        onClick={(
                            event,
                        ) => {
                            event.stopPropagation();
                        }}
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

                            boxShadow:
                                shadow.card,
                        }}
                    >
                        {/* Screenshot Header */}

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                gap:
                                    spacing.md,

                                marginBottom:
                                    spacing.sm,
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        spacing.sm,

                                    minWidth:
                                        0,
                                }}
                            >
                                <ImageIcon
                                    size={15}
                                    color={
                                        theme.color
                                    }
                                />

                                <div
                                    style={{
                                        minWidth:
                                            0,

                                        color:
                                            colors.text,

                                        fontSize:
                                            typography
                                                .tiny
                                                .fontSize,

                                        fontWeight:
                                            600,

                                        overflow:
                                            "hidden",

                                        textOverflow:
                                            "ellipsis",

                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    {screenshotFileName}
                                </div>
                            </div>

                            {/* Actions */}

                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        spacing.xs,

                                    flexShrink:
                                        0,
                                }}
                            >
                                <button
                                    type="button"
                                    title="Open screenshot"
                                    onClick={() =>
                                        openScreenshot(
                                            screenshot!,
                                        )
                                    }
                                    style={{
                                        display:
                                            "inline-flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        gap:
                                            6,

                                        padding:
                                            "6px 9px",

                                        border:
                                            `1px solid ${colors.border}`,

                                        borderRadius:
                                            radius.sm,

                                        background:
                                            colors
                                                .background,

                                        color:
                                            colors.text,

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            typography
                                                .tiny
                                                .fontSize,
                                    }}
                                >
                                    <ExternalLink
                                        size={13}
                                    />

                                    Open
                                </button>

                                <button
                                    type="button"
                                    title="Download screenshot"
                                    onClick={() =>
                                        downloadScreenshot(
                                            screenshot!,
                                            screenshotFileName,
                                        )
                                    }
                                    style={{
                                        display:
                                            "inline-flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        gap:
                                            6,

                                        padding:
                                            "6px 9px",

                                        border:
                                            "none",

                                        borderRadius:
                                            radius.sm,

                                        background:
                                            theme.color,

                                        color:
                                            "#FFFFFF",

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            typography
                                                .tiny
                                                .fontSize,

                                        fontWeight:
                                            600,
                                    }}
                                >
                                    <Download
                                        size={13}
                                    />

                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Screenshot Preview */}

                        <div
                            style={{
                                width:
                                    "100%",

                                maxHeight:
                                    420,

                                overflow:
                                    "auto",

                                borderRadius:
                                    radius.sm,

                                border:
                                    `1px solid ${colors.border}`,

                                background:
                                    "#000",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",
                            }}
                        >
                            <img
                                src={
                                    screenshotSrc!
                                }
                                alt={
                                    `Screenshot ${screenshotFileName}`
                                }
                                style={{
                                    display:
                                        "block",

                                    width:
                                        "100%",

                                    height:
                                        "auto",

                                    maxHeight:
                                        420,

                                    objectFit:
                                        "contain",
                                }}
                            />
                        </div>
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

                                gap:
                                    spacing.sm,

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

                                            gap:
                                                spacing.md,

                                            alignItems:
                                                "start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color:
                                                    colors
                                                        .textMuted,

                                                fontSize:
                                                    typography
                                                        .tiny
                                                        .fontSize,

                                                fontWeight:
                                                    typography
                                                        .caption
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
                                                    typography
                                                        .tiny
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