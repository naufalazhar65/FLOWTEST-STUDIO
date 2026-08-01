import { Smartphone } from "lucide-react";

import { ToolbarBadge } from "../ui/ToolbarBadge";

interface Props {
    platform: "Android" | "iOS" | null;
}

export function PlatformBadge({
    platform,
}: Props) {
    const color =
        platform === "Android"
            ? "#3DDC84"
            : platform === "iOS"
                ? "#A855F7"
                : "#94A3B8";

    const text =
        platform ?? "Select Platform";

    return (
        <ToolbarBadge
            minWidth={150}
            borderColor={color}
        >
            <Smartphone
                size={16}
                color={color}
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