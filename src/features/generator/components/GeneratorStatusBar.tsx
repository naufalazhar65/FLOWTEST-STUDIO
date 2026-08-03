import {
    CheckCircle2,
    FileCode2,
    Smartphone,
} from "lucide-react";

interface GeneratorStatusBarProps {
    framework?: string;

    fileCount: number;

    ready: boolean;
}

export function GeneratorStatusBar({
    framework,
    fileCount,
    ready,
}: GeneratorStatusBarProps) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                border-b
                border-neutral-800
                bg-neutral-950
                px-4
                py-2
                text-xs
            "
        >
            <div className="flex items-center gap-4">

                <StatusItem
                    icon={
                        <Smartphone
                            size={14}
                            className="text-emerald-400"
                        />
                    }
                    label={
                        framework ??
                        "Pytest + Appium"
                    }
                />

                <StatusItem
                    icon={
                        <FileCode2
                            size={14}
                            className="text-blue-400"
                        />
                    }
                    label={`${fileCount} Files`}
                />

            </div>

            <div
                className={`
                    flex
                    items-center
                    gap-1.5

                    ${
                        ready
                            ? "text-emerald-400"
                            : "text-neutral-500"
                    }
                `}
            >
                <CheckCircle2 size={14} />

                {ready
                    ? "Ready"
                    : "Waiting"}
            </div>
        </div>
    );
}

interface StatusItemProps {
    icon: React.ReactNode;

    label: string;
}

function StatusItem({
    icon,
    label,
}: StatusItemProps) {
    return (
        <div
            className="
                flex
                items-center
                gap-1.5
                text-neutral-300
            "
        >
            {icon}

            <span>{label}</span>
        </div>
    );
}