import { Cpu } from "lucide-react";

import { ToolbarBadge } from "../ui/ToolbarBadge";

interface Props {
    status:
    | "offline"
    | "checking"
    | "connected";
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
            ? "Appium Connected"
            : status === "checking"
                ? "Checking Appium..."
                : "Appium Offline";

    return (
        <ToolbarBadge
            minWidth={170}
            color="#E6EDF3"
            icon={
                <Cpu
                    size={16}
                    color={color}
                />
            }
            pulse={
                status === "checking"
            }
        >
            {text}
        </ToolbarBadge>
    );
}