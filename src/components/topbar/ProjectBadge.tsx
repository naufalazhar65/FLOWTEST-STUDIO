import { FileCode2 } from "lucide-react";

import { ToolbarBadge } from "../ui/ToolbarBadge";

interface Props {
    name: string;

    modified: boolean;
}

export function ProjectBadge({
    name,
    modified,
}: Props) {
    return (
        <ToolbarBadge
            minWidth={220}
            icon={
                <FileCode2
                    size={16}
                    color="#8B949E"
                />
            }
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    lineHeight: 1.2,
                }}
            >
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#E6EDF3",
                    }}
                >
                    {name}
                </span>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 3,
                    }}
                >
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: modified
                                ? "#F59E0B"
                                : "#22C55E",

                            boxShadow: modified
                                ? "0 0 6px #F59E0B"
                                : "0 0 6px #22C55E",
                        }}
                    />

                    <span
                        style={{
                            fontSize: 11,
                            color: "#8B949E",
                            fontWeight: 500,
                        }}
                    >
                        {modified
                            ? "Modified"
                            : "Saved"}
                    </span>
                </div>
            </div>
        </ToolbarBadge>
    );
}