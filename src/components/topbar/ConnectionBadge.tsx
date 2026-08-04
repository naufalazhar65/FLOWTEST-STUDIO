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
    const config =
        status === "connected"
            ? {
                  title: "Appium",
                  subtitle: "Connected",
                  icon: "text-emerald-400",
                  badge:
                      "text-emerald-400",
                  dot: "bg-emerald-400",
                  pulse: false,
              }
            : status === "checking"
              ? {
                    title: "Appium",
                    subtitle: "Checking...",
                    icon: "text-amber-400",
                    badge:
                        "text-amber-400",
                    dot: "bg-amber-400",
                    pulse: true,
                }
              : {
                    title: "Appium",
                    subtitle: "Offline",
                    icon: "text-red-400",
                    badge:
                        "text-red-400",
                    dot: "bg-red-400",
                    pulse: false,
                };

    return (
        <ToolbarBadge
            minWidth={190}
            pulse={config.pulse}
            icon={
                <Cpu
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
                        Automation Server
                    </span>

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        {config.title}
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

                    {config.subtitle}
                </div>
            </div>
        </ToolbarBadge>
    );
}