import { Check, Circle, FileCode2 } from "lucide-react";

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
            minWidth={280}
            icon={
                <FileCode2
                    size={17}
                    color="#8B949E"
                />
            }
        >
            <div
                style={{
                    width: "100%",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "space-between",

                    gap: 18,
                }}
            >
                <span
                    style={{
                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",

                        color: "#E6EDF3",

                        fontSize: 13,

                        fontWeight: 600,
                    }}
                >
                    {name}
                </span>

                <div
                    style={{
                        display: "flex",

                        alignItems: "center",

                        gap: 6,

                        flexShrink: 0,
                    }}
                >
                    {modified ? (
                        <Circle
                            size={8}
                            fill="#F59E0B"
                            color="#F59E0B"
                        />
                    ) : (
                        <Check
                            size={12}
                            color="#22C55E"
                        />
                    )}

                    <span
                        style={{
                            color: modified
                                ? "#F59E0B"
                                : "#22C55E",

                            fontSize: 12,

                            fontWeight: 600,
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