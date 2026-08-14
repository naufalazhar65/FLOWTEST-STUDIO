import {
    Check,
    Copy,
    Download,
    FolderKanban,
    Loader2,
    Play,
    X,
} from "lucide-react";

import { useState } from "react";

interface GeneratorHeaderProps {
    hasProject: boolean;

    onGenerate(): void;

    onCopy(): Promise<boolean>;

    onDownload(): Promise<boolean>;
}

type ActionState =
    | "idle"
    | "success"
    | "error";

export function GeneratorHeader({
    hasProject,
    onGenerate,
    onCopy,
    onDownload,
}: GeneratorHeaderProps) {
    const [generating, setGenerating] =
        useState(false);

    const [copyState, setCopyState] =
        useState<ActionState>("idle");

    const [downloadState, setDownloadState] =
        useState<ActionState>("idle");

    async function handleGenerate() {
        if (generating) {
            return;
        }

        setGenerating(true);

        try {
            onGenerate();
        } finally {
            setGenerating(false);
        }
    }

    async function handleCopy() {
        if (copyState === "success") {
            return;
        }

        setCopyState("idle");

        const success = await onCopy();

        setCopyState(
            success
                ? "success"
                : "error",
        );

        window.setTimeout(() => {
            setCopyState("idle");
        }, 1600);
    }

    async function handleDownload() {
        if (downloadState === "success") {
            return;
        }

        setDownloadState("idle");

        const success =
            await onDownload();

        setDownloadState(
            success
                ? "success"
                : "error",
        );

        window.setTimeout(() => {
            setDownloadState("idle");
        }, 1600);
    }

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
                            shrink-0
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
                        icon={
                            generating ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <Play size={16} />
                            )
                        }
                        disabled={generating}
                        onClick={handleGenerate}
                    >
                        {generating
                            ? "Generating..."
                            : "Generate"}
                    </PrimaryButton>

                    <SecondaryButton
                        icon={
                            copyState === "success" ? (
                                <Check
                                    size={15}
                                />
                            ) : copyState ===
                              "error" ? (
                                <X
                                    size={15}
                                />
                            ) : (
                                <Copy size={15} />
                            )
                        }
                        disabled={
                            !hasProject
                        }
                        onClick={handleCopy}
                    >
                        {copyState === "success"
                            ? "Copied"
                            : copyState === "error"
                              ? "Copy failed"
                              : "Copy"}
                    </SecondaryButton>

                    <SecondaryButton
                        icon={
                            downloadState ===
                            "success" ? (
                                <Check
                                    size={15}
                                />
                            ) : downloadState ===
                              "error" ? (
                                <X
                                    size={15}
                                />
                            ) : (
                                <Download
                                    size={15}
                                />
                            )
                        }
                        disabled={
                            !hasProject
                        }
                        onClick={
                            handleDownload
                        }
                    >
                        {downloadState ===
                        "success"
                            ? "Downloaded"
                            : downloadState ===
                                "error"
                              ? "Download failed"
                              : "Download"}
                    </SecondaryButton>
                </div>
            </div>
        </header>
    );
}

interface ButtonProps {
    icon: React.ReactNode;

    children: React.ReactNode;

    onClick(): void | Promise<void>;

    disabled?: boolean;
}

function PrimaryButton({
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
                flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition-all
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60

                ${
                    disabled
                        ? `
                            cursor-not-allowed
                            bg-blue-600/50
                        `
                        : `
                            bg-blue-600
                            hover:bg-blue-500
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
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60

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