import {
    CheckCircle2,
    CircleAlert,
    Download,
    ExternalLink,
    Image as ImageIcon,
    Settings2,
} from "lucide-react";

import {
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../themes";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useAppiumConfigStore } from "../../features/execution/store/useAppiumConfigStore";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";

import { InspectorField } from "../../features/flow/components/inspector/InspectorField";
import { getNodePlugin } from "../../features/flow/services/pluginRegistry";
import { validateNode } from "../../features/flow/validation/validateNode";

import {
    createNodeFieldPatch,
} from "../../features/flow/utils/updateNodeField";

import { Badge } from "../ui/Badge";
import { Divider } from "../ui/Divider";
import { EmptyState } from "../ui/EmptyState";

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

function normalizeScreenshotFileName(
    fileName?: string,
): string {
    const value =
        fileName?.trim();

    if (!value) {
        return "screenshot.png";
    }

    return value
        .toLowerCase()
        .endsWith(".png")
        ? value
        : `${value}.png`;
}

function openScreenshot(
    screenshot?: string,
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
                        min-height: 100%;
                        background: #0D1117;
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

function downloadScreenshot(
    screenshot?: string,
    fileName?: string,
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

export function InspectorPanel() {
    const {
        nodes,
        selectedNodeId,
        updateNodeData,
    } = useFlowStore();

    const globalPlatform =
        useAppiumConfigStore(
            (state) =>
                state.config.platformName,
        );

    const nodeResults =
        useExecutionStore(
            (state) =>
                state.nodeResults,
        );

    const node = nodes.find(
        (item) =>
            item.id ===
            selectedNodeId,
    );

    if (!node) {
        return (
            <div
                style={{
                    height: "100%",
                    minHeight: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    padding: spacing.xl,
                    boxSizing:
                        "border-box",
                }}
            >
                <EmptyState
                    icon={
                        <Settings2
                            size={34}
                        />
                    }
                    title="No node selected"
                    description="Select a node on the canvas to edit its properties."
                />
            </div>
        );
    }

    const plugin = getNodePlugin(
        node.data.action,
    );

    const validation =
        validateNode(
            node.data,
        );

    const nodeData =
        node.data as unknown as Record<
            string,
            unknown
        >;

    const platform =
        typeof nodeData.platform ===
            "string"
            ? (nodeData.platform as
                | "Android"
                | "iOS")
            : globalPlatform;

    const visibleFields =
        plugin.fields.filter(
            (field) => {
                if (
                    !field.visibleWhen
                ) {
                    return true;
                }

                if (
                    field.visibleWhen
                        .platform &&
                    field.visibleWhen
                        .platform !==
                    platform
                ) {
                    return false;
                }

                return true;
            },
        );

    const nodeResult =
        selectedNodeId
            ? nodeResults[
            selectedNodeId
            ]
            : undefined;

    const screenshotSrc =
        getScreenshotSrc(
            nodeResult?.screenshot,
        );

    const screenshotFileName =
        normalizeScreenshotFileName(
            nodeResult?.screenshotFileName ??
            (typeof nodeData.fileName ===
                "string"
                ? nodeData.fileName
                : undefined),
        );

    const hasScreenshot =
        !!screenshotSrc;

    const isScreenshotNode =
        node.data.action ===
        "screenshot";

    const hasExecutionResult =
        !!nodeResult;

    return (
        <div
            style={{
                height: "100%",
                minHeight: 0,

                overflowY: "auto",
                overflowX: "hidden",

                padding:
                    spacing.lg,

                boxSizing:
                    "border-box",

                color:
                    colors.text,

                background:
                    colors.background,

                overscrollBehavior:
                    "contain",
            }}
        >
            {/* Node identity */}

            <div
                style={{
                    display:
                        "flex",

                    flexDirection:
                        "column",

                    gap:
                        spacing.sm,
                }}
            >
                <Badge
                    color={
                        plugin.color
                    }
                    style={{
                        alignSelf:
                            "flex-start",

                        minHeight: 22,

                        padding:
                            `${spacing.xs}px ${spacing.sm}px`,

                        fontSize:
                            typography
                                .tiny
                                .fontSize,
                    }}
                >
                    {plugin.title.toUpperCase()}
                </Badge>

                <h2
                    style={{
                        margin: 0,

                        color:
                            colors.text,

                        fontSize: 22,

                        fontWeight: 700,

                        lineHeight: 1.25,

                        letterSpacing:
                            "-0.02em",
                    }}
                >
                    {plugin.title}
                </h2>

                <p
                    style={{
                        margin: 0,

                        color:
                            colors.textSecondary,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

                        lineHeight:
                            1.55,
                    }}
                >
                    {plugin.subtitle}
                </p>
            </div>

            {/* General */}

            <Section title="General">
                {visibleFields.map(
                    (field) => (
                        <InspectorField
                            key={
                                field.key
                            }
                            field={
                                field
                            }
                            value={
                                nodeData[
                                field.key
                                ]
                            }
                            onChange={(
                                value,
                            ) =>
                                updateNodeData(
                                    node.id,
                                    createNodeFieldPatch(
                                        field.key,
                                        value,
                                    ),
                                )
                            }
                        />
                    ),
                )}
            </Section>

            {/* Preview */}

            <Section title="Preview">
                <div
                    style={{
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
                    {plugin.preview?.(
                        node.data,
                    )}
                </div>
            </Section>

            {/* Last Execution */}

            <Section title="Last Execution">
                {!hasExecutionResult ? (
                    <ExecutionEmptyState
                        isScreenshotNode={
                            isScreenshotNode
                        }
                    />
                ) : (
                    <div
                        style={{
                            display:
                                "flex",

                            flexDirection:
                                "column",

                            gap:
                                spacing.md,
                        }}
                    >
                        <ExecutionResultHeader
                            status={
                                nodeResult.status
                            }
                        />

                        {hasScreenshot ? (
                            <div
                                style={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap:
                                        spacing.sm,

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
                                <div
                                    style={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "space-between",

                                        gap:
                                            spacing.sm,
                                    }}
                                >
                                    <div
                                        style={{
                                            minWidth:
                                                0,

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap:
                                                spacing.sm,
                                        }}
                                    >
                                        <ImageIcon
                                            size={
                                                16
                                            }
                                            color={
                                                plugin.color
                                            }
                                        />

                                        <span
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
                                            {
                                                screenshotFileName
                                            }
                                        </span>
                                    </div>

                                    <span
                                        style={{
                                            flexShrink:
                                                0,

                                            color:
                                                colors
                                                    .textMuted,

                                            fontSize:
                                                typography
                                                    .tiny
                                                    .fontSize,
                                        }}
                                    >
                                        PNG
                                    </span>
                                </div>

                                <div
                                    style={{
                                        overflow:
                                            "auto",

                                        maxHeight:
                                            360,

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
                                            screenshotSrc
                                        }
                                        alt={
                                            `Execution screenshot ${screenshotFileName}`
                                        }
                                        style={{
                                            display:
                                                "block",

                                            width:
                                                "100%",

                                            height:
                                                "auto",

                                            objectFit:
                                                "contain",
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        gap:
                                            spacing.sm,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openScreenshot(
                                                nodeResult.screenshot,
                                            )
                                        }
                                        style={{
                                            flex:
                                                1,

                                            display:
                                                "inline-flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            gap:
                                                6,

                                            padding:
                                                "8px 10px",

                                            border:
                                                `1px solid ${colors.border}`,

                                            borderRadius:
                                                radius.sm,

                                            background:
                                                colors.background,

                                            color:
                                                colors.text,

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
                                        <ExternalLink
                                            size={
                                                14
                                            }
                                        />

                                        Open
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            downloadScreenshot(
                                                nodeResult.screenshot,
                                                screenshotFileName,
                                            )
                                        }
                                        style={{
                                            flex:
                                                1,

                                            display:
                                                "inline-flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            gap:
                                                6,

                                            padding:
                                                "8px 10px",

                                            border:
                                                "none",

                                            borderRadius:
                                                radius.sm,

                                            background:
                                                plugin.color,

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
                                            size={
                                                14
                                            }
                                        />

                                        Download
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding:
                                        spacing.md,

                                    borderRadius:
                                        radius.md,

                                    border:
                                        `1px solid ${colors.border}`,

                                    background:
                                        colors.panel,

                                    color:
                                        colors
                                            .textSecondary,

                                    fontSize:
                                        typography
                                            .tiny
                                            .fontSize,

                                    lineHeight:
                                        1.5,
                                }}
                            >
                                {isScreenshotNode
                                    ? "The node executed successfully, but no screenshot data is available."
                                    : "No screenshot artifact was produced by this execution."}
                            </div>
                        )}
                    </div>
                )}
            </Section>

            {/* Validation */}

            <Section title="Validation">
                {validation.valid ? (
                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "flex-start",

                            gap:
                                spacing.sm,

                            padding:
                                spacing.md,

                            borderRadius:
                                radius.md,

                            background:
                                `${colors.success}12`,

                            border:
                                `1px solid ${colors.success}38`,

                            color:
                                colors.success,
                        }}
                    >
                        <CheckCircle2
                            size={18}
                            style={{
                                flexShrink:
                                    0,
                            }}
                        />

                        <div
                            style={{
                                minWidth:
                                    0,

                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap:
                                    spacing.xs,
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        typography
                                            .body
                                            .fontSize,

                                    fontWeight:
                                        typography
                                            .subtitle
                                            .fontWeight,

                                    lineHeight:
                                        1.35,
                                }}
                            >
                                Configuration valid
                            </div>

                            <div
                                style={{
                                    color:
                                        colors
                                            .textSecondary,

                                    fontSize:
                                        typography
                                            .tiny
                                            .fontSize,

                                    lineHeight:
                                        1.4,
                                }}
                            >
                                This node is ready for execution.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "flex-start",

                            gap:
                                spacing.sm,

                            padding:
                                spacing.md,

                            borderRadius:
                                radius.md,

                            background:
                                `${colors.danger}12`,

                            border:
                                `1px solid ${colors.danger}40`,

                            color:
                                colors.danger,
                        }}
                    >
                        <CircleAlert
                            size={18}
                            style={{
                                flexShrink:
                                    0,
                            }}
                        />

                        <div
                            style={{
                                minWidth:
                                    0,

                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    marginBottom:
                                        spacing.sm,

                                    color:
                                        colors.text,

                                    fontSize:
                                        typography
                                            .body
                                            .fontSize,

                                    fontWeight:
                                        typography
                                            .subtitle
                                            .fontWeight,

                                    lineHeight:
                                        1.35,
                                }}
                            >
                                Validation errors
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap:
                                        spacing.xs,
                                }}
                            >
                                {validation.errors.map(
                                    (
                                        error,
                                    ) => (
                                        <div
                                            key={
                                                error
                                            }
                                            style={{
                                                color:
                                                    colors
                                                        .textSecondary,

                                                fontSize:
                                                    typography
                                                        .tiny
                                                        .fontSize,

                                                lineHeight:
                                                    1.5,
                                            }}
                                        >
                                            •{" "}
                                            {
                                                error
                                            }
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Section>
        </div>
    );
}

interface ExecutionResultHeaderProps {
    status: string;
}

function ExecutionResultHeader({
    status,
}: ExecutionResultHeaderProps) {
    const passed =
        status ===
        "passed";

    const failed =
        status ===
        "failed";

    const color =
        passed
            ? colors.success
            : failed
                ? colors.danger
                : colors.textSecondary;

    return (
        <div
            style={{
                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    spacing.sm,

                padding:
                    `${spacing.sm}px ${spacing.md}px`,

                borderRadius:
                    radius.md,

                background:
                    `${color}10`,

                border:
                    `1px solid ${color}35`,
            }}
        >
            {passed ? (
                <CheckCircle2
                    size={16}
                    color={color}
                />
            ) : (
                <CircleAlert
                    size={16}
                    color={color}
                />
            )}

            <div
                style={{
                    color,
                    fontSize:
                        typography
                            .tiny
                            .fontSize,
                    fontWeight:
                        700,
                    textTransform:
                        "uppercase",
                    letterSpacing:
                        "0.06em",
                }}
            >
                {status}
            </div>
        </div>
    );
}

interface ExecutionEmptyStateProps {
    isScreenshotNode: boolean;
}

function ExecutionEmptyState({
    isScreenshotNode,
}: ExecutionEmptyStateProps) {
    return (
        <div
            style={{
                display:
                    "flex",

                flexDirection:
                    "column",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                gap:
                    spacing.sm,

                minHeight:
                    120,

                padding:
                    spacing.lg,

                borderRadius:
                    radius.md,

                background:
                    colors.panel,

                border:
                    `1px dashed ${colors.border}`,

                color:
                    colors.textMuted,

                textAlign:
                    "center",
            }}
        >
            <ImageIcon
                size={24}
            />

            <div
                style={{
                    fontSize:
                        typography
                            .tiny
                            .fontSize,

                    lineHeight:
                        1.5,
                }}
            >
                {isScreenshotNode
                    ? "Run this node to capture a screenshot."
                    : "No execution result available for this node yet."}
            </div>
        </div>
    );
}

interface SectionProps {
    title: string;

    children: React.ReactNode;
}

function Section({
    title,
    children,
}: SectionProps) {
    return (
        <section
            style={{
                marginTop:
                    spacing.xl,

                marginBottom:
                    spacing.xl,
            }}
        >
            <Divider
                vertical={false}
            />

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    marginTop:
                        spacing.md,

                    marginBottom:
                        spacing.md,
                }}
            >
                <span
                    style={{
                        color:
                            colors
                                .textSecondary,

                        fontSize:
                            typography
                                .tiny
                                .fontSize,

                        fontWeight:
                            typography
                                .caption
                                .fontWeight,

                        letterSpacing:
                            "0.08em",

                        textTransform:
                            "uppercase",
                    }}
                >
                    {title}
                </span>
            </div>

            {children}
        </section>
    );
}