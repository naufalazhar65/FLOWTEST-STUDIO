import {
    CheckCircle2,
    Circle,
    FileCode2,
} from "lucide-react";

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
            minWidth={300}
            icon={
                <FileCode2
                    size={17}
                    className="text-blue-400"
                />
            }
        >
            <div
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            truncate
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        {name}
                    </span>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        px-2
                        py-1
                    "
                >
                    {modified ? (
                        <>
                            <Circle
                                size={8}
                                fill="#F59E0B"
                                className="text-amber-500"
                            />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    text-amber-400
                                "
                            >
                                Modified
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2
                                size={14}
                                className="text-emerald-400"
                            />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    text-emerald-400
                                "
                            >
                                Saved
                            </span>
                        </>
                    )}
                </div>
            </div>
        </ToolbarBadge>
    );
}