import {
    Copy,
    Download,
    FolderKanban,
    Play,
} from "lucide-react";

interface GeneratorHeaderProps {
    hasProject: boolean;

    onGenerate(): void;

    onCopy(): void;

    onDownload(): void;
}

export function GeneratorHeader({
    hasProject,
    onGenerate,
    onCopy,
    onDownload,
}: GeneratorHeaderProps) {
    return (
        <header
            className="
                border-b
                border-neutral-800
                bg-neutral-900
            "
        >
            <div className="px-4 py-4">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-blue-500/20
                            bg-blue-500/10
                        "
                    >
                        <FolderKanban
                            size={20}
                            className="text-blue-400"
                        />
                    </div>

                    <div className="min-w-0">

                        <h2
                            className="
                                truncate
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Generated Project
                        </h2>

                        <p
                            className="
                                truncate
                                text-xs
                                text-neutral-500
                            "
                        >
                            FlowTest Studio Generator
                        </p>

                    </div>

                </div>

                <div className="mt-4 flex gap-2">

                    <PrimaryButton
                        icon={<Play size={16} />}
                        onClick={onGenerate}
                    >
                        Generate
                    </PrimaryButton>

                    <SecondaryButton
                        icon={<Copy size={15} />}
                        disabled={!hasProject}
                        onClick={onCopy}
                    >
                        Copy
                    </SecondaryButton>

                    <SecondaryButton
                        icon={<Download size={15} />}
                        disabled={!hasProject}
                        onClick={onDownload}
                    >
                        Download
                    </SecondaryButton>

                </div>

            </div>

        </header>
    );
}

interface ButtonProps {
    icon: React.ReactNode;

    children: React.ReactNode;

    onClick(): void;

    disabled?: boolean;
}

function PrimaryButton({
    icon,
    children,
    onClick,
}: ButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition-all
                hover:bg-blue-500
                active:scale-[0.98]
            "
        >
            {icon}

            {children}
        </button>
    );
}

function SecondaryButton({
    icon,
    children,
    onClick,
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-3
                py-2.5
                text-sm
                transition-all

                ${
                    disabled
                        ? `
                            cursor-not-allowed
                            border-neutral-800
                            bg-neutral-900
                            text-neutral-600
                        `
                        : `
                            border-neutral-700
                            bg-neutral-800
                            text-neutral-200
                            hover:border-blue-500
                            hover:bg-neutral-700
                            hover:text-white
                            active:scale-[0.98]
                        `
                }
            `}
        >
            {icon}

            {children}
        </button>
    );
}