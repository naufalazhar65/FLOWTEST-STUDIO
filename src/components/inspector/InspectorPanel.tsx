import { CheckCircle2, CircleAlert, Settings2 } from "lucide-react";

import {
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../themes";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useAppiumConfigStore } from "../../features/execution/store/useAppiumConfigStore";

import { InspectorField } from "../../features/flow/components/inspector/InspectorField";
import { getNodePlugin } from "../../features/flow/services/pluginRegistry";
import { validateNode } from "../../features/flow/validation/validateNode";
import {
    createNodeFieldPatch,
} from "../../features/flow/utils/updateNodeField";

import { Badge } from "../ui/Badge";
import { Divider } from "../ui/Divider";
import { EmptyState } from "../ui/EmptyState";

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

    const validation = validateNode(
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
                    display: "flex",
                    flexDirection: "column",
                    gap: spacing.sm,
                }}
            >
                <Badge
                    color={plugin.color}
                    style={{
                        alignSelf:
                            "flex-start",

                        minHeight: 22,

                        padding:
                            `${spacing.xs}px ${spacing.sm}px`,

                        fontSize:
                            typography.tiny
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

                        lineHeight: 1.55,
                    }}
                >
                    {plugin.subtitle}
                </p>
            </div>

            <Section title="General">
                {visibleFields.map(
                    (field) => (
                        <InspectorField
                            key={field.key}
                            field={field}
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

            <Section title="Validation">
                {validation.valid ? (
                    <div
                        style={{
                            display: "flex",

                            alignItems:
                                "flex-start",

                            gap: spacing.sm,

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
                                flexShrink: 0,
                            }}
                        />

                        <div
                            style={{
                                minWidth: 0,

                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap: spacing.xs,
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        typography.body
                                            .fontSize,

                                    fontWeight:
                                        typography.subtitle
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
                                        colors.textSecondary,

                                    fontSize:
                                        typography.tiny
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
                            display: "flex",

                            alignItems:
                                "flex-start",

                            gap: spacing.sm,

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
                                flexShrink: 0,
                            }}
                        />

                        <div
                            style={{
                                minWidth: 0,

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
                                        typography.body
                                            .fontSize,

                                    fontWeight:
                                        typography.subtitle
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

                                    gap: spacing.xs,
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
                                                    colors.textSecondary,

                                                fontSize:
                                                    typography.tiny
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
                    display: "flex",

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
                            colors.textSecondary,

                        fontSize:
                            typography.tiny
                                .fontSize,

                        fontWeight:
                            typography.caption
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