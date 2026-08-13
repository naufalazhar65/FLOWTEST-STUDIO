import {
    ArrowUpRight,
    FolderOpen,
} from "lucide-react";

import {
    animation,
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../../themes";

import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";

import { useRecentProjects } from "../../../features/project/hooks/useRecentProjects";

import { openRecentProjectWorkflow } from "../../../features/project/workflows/openRecentProjectWorkflow";

export function RecentProjects() {
    const projects =
        useRecentProjects();

    return (
        <Card
            style={{
                width:
                    "min(760px, calc(100vw - 48px))",

                padding:
                    spacing.xl,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    marginBottom:
                        spacing.lg,
                }}
            >
                <div
                    style={{
                        fontSize:
                            typography.title
                                .fontSize,

                        fontWeight:
                            typography.title
                                .fontWeight,

                        color:
                            colors.text,
                    }}
                >
                    Recent Projects
                </div>

                {projects.length > 0 && (
                    <Badge
                        color={
                            colors.textSecondary
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
                        {projects.length}{" "}
                        {projects.length ===
                        1
                            ? "project"
                            : "projects"}
                    </Badge>
                )}
            </div>

            {projects.length === 0 ? (
                <EmptyState
                    icon={
                        <FolderOpen
                            size={34}
                        />
                    }
                    title="No recent projects"
                    description="Projects you open will appear here."
                />
            ) : (
                <div
                    style={{
                        maxHeight: 250,

                        overflowY:
                            "auto",

                        display: "flex",

                        flexDirection:
                            "column",

                        gap: spacing.sm,

                        paddingRight:
                            spacing.xs,

                        scrollbarWidth:
                            "thin",

                        scrollbarColor:
                            `${colors.border} transparent`,
                    }}
                >
                    {projects.map(
                        (project) => (
                            <button
                                key={
                                    project.id
                                }
                                type="button"
                                onClick={() => {
                                    void openRecentProjectWorkflow(
                                        project,
                                    );
                                }}
                                style={{
                                    width: "100%",

                                    minHeight: 58,

                                    flexShrink: 0,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap: spacing.md,

                                    padding:
                                        `${spacing.sm + 1}px ${spacing.md}px`,

                                    textAlign:
                                        "left",

                                    background:
                                        "rgba(13, 17, 23, 0.45)",

                                    border:
                                        `1px solid ${colors.border}`,

                                    borderRadius:
                                        radius.md,

                                    cursor:
                                        "pointer",

                                    color:
                                        colors.text,

                                    transition:
                                        `background ${animation.fast}, border-color ${animation.fast}, transform ${animation.fast}, box-shadow ${animation.fast}`,

                                    outline:
                                        "none",
                                }}
                                onMouseEnter={(
                                    event,
                                ) => {
                                    const target =
                                        event.currentTarget;

                                    target.style.background =
                                        colors.selection;

                                    target.style.borderColor =
                                        colors.focus;

                                    target.style.transform =
                                        "translateX(2px)";

                                    target.style.boxShadow =
                                        shadow.card;

                                    const arrow =
                                        target.querySelector(
                                            "[data-project-arrow]",
                                        );

                                    if (
                                        arrow instanceof
                                        HTMLElement
                                    ) {
                                        arrow.style.opacity =
                                            "1";

                                        arrow.style.transform =
                                            "translate(0, 0)";
                                    }
                                }}
                                onMouseLeave={(
                                    event,
                                ) => {
                                    const target =
                                        event.currentTarget;

                                    target.style.background =
                                        "rgba(13, 17, 23, 0.45)";

                                    target.style.borderColor =
                                        colors.border;

                                    target.style.transform =
                                        "translateX(0)";

                                    target.style.boxShadow =
                                        "none";

                                    const arrow =
                                        target.querySelector(
                                            "[data-project-arrow]",
                                        );

                                    if (
                                        arrow instanceof
                                        HTMLElement
                                    ) {
                                        arrow.style.opacity =
                                            "0";

                                        arrow.style.transform =
                                            "translate(-3px, 3px)";
                                    }
                                }}
                                onFocus={(
                                    event,
                                ) => {
                                    event.currentTarget.style.borderColor =
                                        colors.focus;

                                    event.currentTarget.style.boxShadow =
                                        `0 0 0 2px ${colors.selection}`;
                                }}
                                onBlur={(
                                    event,
                                ) => {
                                    event.currentTarget.style.borderColor =
                                        colors.border;

                                    event.currentTarget.style.boxShadow =
                                        "none";
                                }}
                            >
                                {/* Project icon */}
                                <div
                                    style={{
                                        width: 36,

                                        height: 36,

                                        flexShrink: 0,

                                        display:
                                            "grid",

                                        placeItems:
                                            "center",

                                        borderRadius:
                                            radius.md,

                                        background:
                                            colors.selection,

                                        border:
                                            `1px solid ${colors.focus}2E`,

                                        color:
                                            colors.accentHover,
                                    }}
                                >
                                    <FolderOpen
                                        size={17}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                </div>

                                {/* Project information */}
                                <div
                                    style={{
                                        minWidth: 0,

                                        flex: 1,
                                    }}
                                >
                                    <div
                                        style={{
                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap",

                                            fontSize:
                                                typography
                                                    .body
                                                    .fontSize,

                                            fontWeight:
                                                typography
                                                    .subtitle
                                                    .fontWeight,

                                            color:
                                                colors.text,
                                        }}
                                    >
                                        {
                                            project.name
                                        }
                                    </div>

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

                                            fontSize:
                                                typography
                                                    .tiny
                                                    .fontSize,

                                            fontWeight:
                                                typography
                                                    .tiny
                                                    .fontWeight,

                                            color:
                                                colors.textSecondary,
                                        }}
                                    >
                                        {
                                            project.fileName
                                        }
                                    </div>
                                </div>

                                {/* Open indicator */}
                                <div
                                    data-project-arrow
                                    style={{
                                        flexShrink: 0,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        color:
                                            colors.accentHover,

                                        opacity: 0,

                                        transform:
                                            "translate(-3px, 3px)",

                                        transition:
                                            `opacity ${animation.fast}, transform ${animation.fast}`,
                                    }}
                                >
                                    <ArrowUpRight
                                        size={17}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                </div>
                            </button>
                        ),
                    )}
                </div>
            )}
        </Card>
    );
}