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

    return (
        <ToolbarBadge
            minWidth={145}
            icon={
                <Smartphone
                    size={16}
                    color={color}
                />
            }
            color="#E6EDF3"
        >
            {platform ?? "Select Platform"}
        </ToolbarBadge>
    );
}