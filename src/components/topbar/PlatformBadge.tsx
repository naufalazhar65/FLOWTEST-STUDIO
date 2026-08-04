import { Smartphone } from "lucide-react";

import { ToolbarBadge } from "../ui/ToolbarBadge";

interface Props {
    platform: "Android" | "iOS" | null;
}

export function PlatformBadge({
    platform,
}: Props) {
    const config =
        platform === "Android"
            ? {
                label: "Android",
                icon: "text-emerald-400",
                badge:
                    "text-emerald-400",
                dot: "bg-emerald-400",
            }
            : platform === "iOS"
                ? {
                    label: "iOS",
                    icon: "text-violet-400",
                    badge:
                        "text-violet-400",
                    dot: "bg-violet-400",
                }
                : {
                    label: "No Platform",
                    icon: "text-neutral-500",
                    badge:
                        "text-neutral-400",
                    dot: "bg-neutral-500",
                };

    return (
        <ToolbarBadge
            minWidth={180}
            icon={
                <Smartphone
                    size={17}
                    className={config.icon}
                />
            }
        >
            <div
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        leading-tight
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-neutral-500
                        "
                    >
                        Target Platform
                    </span>

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        {config.label}
                    </span>
                </div>

                <div
                    className={`
                        flex
                        items-center
                        gap-2
                        rounded-full
                        px-2
                        py-1
                        text-xs
                        font-semibold
                        ${config.badge}
                    `}
                >
                    <div
                        className={`
                            h-2
                            w-2
                            rounded-full
                            ${config.dot}
                        `}
                    />

                    {platform
                        ? "Ready"
                        : "Not Set"}
                </div>
            </div>
        </ToolbarBadge>
    );
}