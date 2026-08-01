import { ToolbarBadge } from "../ui/ToolbarBadge";
import { StatusDot } from "../ui/StatusDot";

import type {
    AppiumConnectionStatus,
} from "../../features/execution/store/useExecutionStore";

interface Props {
    status: AppiumConnectionStatus;
}

export function ConnectionBadge({
    status,
}: Props) {
    const color =
        status === "connected"
            ? "#22C55E"
            : status === "checking"
                ? "#F59E0B"
                : "#EF4444";

    const text =
        status === "connected"
            ? "Connected"
            : status === "checking"
                ? "Checking..."
                : "Offline";

    return (
        <ToolbarBadge
            minWidth={170}
            borderColor={color}
            background={`${color}15`}
        >
            <StatusDot
                color={color}
                animated={
                    status === "checking"
                }
            />

            <span
                style={{
                    color: "#E6EDF3",
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                {text}
            </span>
        </ToolbarBadge>
    );
}