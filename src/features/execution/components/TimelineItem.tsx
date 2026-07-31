import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import type { ExecutionLog } from "../store/useExecutionLogStore";

import { Badge } from "../../../components/ui/Badge";
import { getExecutionNodeTheme } from "../theme/executionNodeTheme";
import { formatLogLabel } from "../utils/formatLogLabel";

interface Props {
    log: ExecutionLog;
}

export function TimelineItem({ log }: Props) {
    const [expanded, setExpanded] = useState(false);

    const hasDetails =
        !!log.details &&
        Object.keys(log.details).length > 0;

    const theme = getExecutionNodeTheme(log.nodeType);

    const Icon = theme.icon;

    return (
        <div
            onClick={() => {
                if (hasDetails) {
                    setExpanded((v) => !v);
                }
            }}
            style={{
                display: "flex",
                gap: 12,
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                borderLeft: `4px solid ${theme.color}`,
                borderBottom:
                    "1px solid rgba(255,255,255,.05)",
                background: "#0F1722",
                cursor: hasDetails ? "pointer" : "default",
            }}
        >
            {/* Time */}
            <div
                style={{
                    width: 70,
                    color: "#8B949E",
                    fontSize: 12,
                    flexShrink: 0,
                }}
            >
                {new Date(log.timestamp).toLocaleTimeString()}
            </div>

            {/* Expand Icon */}
            <div
                style={{
                    width: 18,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: 2,
                    color: "#8B949E",
                }}
            >
                {hasDetails ? (
                    expanded ? (
                        <ChevronDown size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )
                ) : null}
            </div>

            {/* Badge */}
            {log.nodeType && (
                <Badge color={theme.color}>
                    {log.nodeType.toUpperCase()}
                </Badge>
            )}

            {/* Content */}
            <div
                style={{
                    flex: 1,
                }}
            >
                {/* Message */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Icon
                        size={15}
                        color={theme.color}
                    />

                    <div
                        style={{
                            color: "#FFF",
                            fontWeight: 500,
                        }}
                    >
                        {log.message}
                    </div>
                </div>

                {/* Node Title */}
                {log.nodeTitle && (
                    <div
                        style={{
                            color: "#8B949E",
                            fontSize: 12,
                            marginTop: 4,
                        }}
                    >
                        {log.nodeTitle}
                    </div>
                )}

                {/* Duration */}
                {log.duration !== undefined && (
                    <div
                        style={{
                            color: "#8B949E",
                            fontSize: 12,
                            marginTop: 4,
                        }}
                    >
                        {Math.round(log.duration)} ms
                    </div>
                )}

                {/* Details */}
                {expanded && hasDetails && (
                    <div
                        style={{
                            marginTop: 10,
                            padding: 12,
                            borderRadius: 8,
                            background: "#161B22",
                            border:
                                "1px solid rgba(255,255,255,.08)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        {Object.entries(log.details!).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 130,
                                            color: "#8B949E",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {formatLogLabel(key)}
                                    </div>

                                    <div
                                        style={{
                                            color: "#FFF",
                                            fontSize: 12,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {String(value)}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}