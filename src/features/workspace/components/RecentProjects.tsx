import {
    ArrowUpRight,
    FolderOpen,
} from "lucide-react";

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
                width: "min(760px, calc(100vw - 48px))",
                padding: 20,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    marginBottom: 14,
                }}
            >
                <div
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#F0F6FC",
                    }}
                >
                    Recent Projects
                </div>

                {projects.length > 0 && (
                    <div
                        style={{
                            fontSize: 11,
                            color: "#6E7681",
                        }}
                    >
                        {projects.length}{" "}
                        {projects.length === 1
                            ? "project"
                            : "projects"}
                    </div>
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
                        overflowY: "auto",

                        display: "flex",
                        flexDirection:
                            "column",

                        gap: 7,

                        paddingRight: 4,

                        scrollbarWidth: "thin",

                        scrollbarColor:
                            "#30363D transparent",
                    }}
                >
                    {projects.map(
                        (project) => (
                            <button
                                key={project.id}
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

                                    display: "flex",
                                    alignItems:
                                        "center",

                                    gap: 12,

                                    padding:
                                        "9px 12px",

                                    textAlign:
                                        "left",

                                    background:
                                        "rgba(13, 17, 23, 0.45)",

                                    border:
                                        "1px solid #30363D",

                                    borderRadius: 9,

                                    cursor:
                                        "pointer",

                                    color:
                                        "#F0F6FC",

                                    transition:
                                        "background .16s ease, border-color .16s ease, transform .16s ease, box-shadow .16s ease",

                                    outline: "none",
                                }}
                                onMouseEnter={(
                                    event,
                                ) => {
                                    const target =
                                        event.currentTarget;

                                    target.style.background =
                                        "rgba(59, 130, 246, 0.06)";

                                    target.style.borderColor =
                                        "rgba(59, 130, 246, 0.35)";

                                    target.style.transform =
                                        "translateX(2px)";

                                    target.style.boxShadow =
                                        "0 6px 18px rgba(0, 0, 0, 0.16)";

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
                                        "#30363D";

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
                                        "rgba(59, 130, 246, 0.5)";
                                }}
                                onBlur={(
                                    event,
                                ) => {
                                    event.currentTarget.style.borderColor =
                                        "#30363D";
                                }}
                            >
                                {/* Project icon */}
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,

                                        flexShrink: 0,

                                        display: "grid",
                                        placeItems:
                                            "center",

                                        borderRadius: 9,

                                        background:
                                            "rgba(124, 92, 252, 0.10)",

                                        border:
                                            "1px solid rgba(124, 92, 252, 0.16)",

                                        color:
                                            "#A78BFA",
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

                                            fontSize: 13,

                                            fontWeight:
                                                600,

                                            color:
                                                "#F0F6FC",
                                        }}
                                    >
                                        {
                                            project.name
                                        }
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 3,

                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap",

                                            fontSize: 11,

                                            color:
                                                "#8B949E",
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
                                            "#8B5CF6",

                                        opacity: 0,

                                        transform:
                                            "translate(-3px, 3px)",

                                        transition:
                                            "opacity .16s ease, transform .16s ease",
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