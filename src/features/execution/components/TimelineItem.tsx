import type { ExecutionLog } from "../store/useExecutionLogStore";

import { Badge } from "../../../components/ui/Badge";

interface Props {
    log: ExecutionLog;
}

function badgeColor(type?: string) {
    switch (type) {
        case "tap":
            return "#22C55E";

        case "input":
            return "#3B82F6";

        case "assert":
            return "#F59E0B";

        default:
            return "#6B7280";
    }
}

export function TimelineItem({
    log,
}: Props) {
    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom:
                    "1px solid rgba(255,255,255,.05)",
            }}
        >
            <div
                style={{
                    width: 70,
                    color: "#8B949E",
                    fontSize: 12,
                }}
            >
                {new Date(
                    log.timestamp
                ).toLocaleTimeString()}
            </div>

            {log.nodeType && (
                <Badge
                    color={badgeColor(
                        log.nodeType
                    )}
                >
                    {log.nodeType.toUpperCase()}
                </Badge>
            )}

            <div
                style={{
                    flex: 1,
                }}
            >
                <div
                    style={{
                        color: "#FFF",
                    }}
                >
                    {log.message}
                </div>

                {log.duration !==
                    undefined && (
                        <div
                            style={{
                                color: "#8B949E",
                                fontSize: 12,
                                marginTop: 4,
                            }}
                        >
                            {Math.round(
                                log.duration
                            )} ms
                        </div>
                    )}
            </div>
        </div>
    );
}