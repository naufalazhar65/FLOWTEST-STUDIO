interface Props {
    language: string;
}

export function EditorStatusBar({
    language,
}: Props) {
    return (
        <div
            className="
                flex
                min-h-7
                items-center
                justify-end
                gap-4
                border-t
                border-neutral-800
                bg-neutral-900
                px-3
                py-1
                text-[11px]
                text-neutral-500
                select-none
            "
        >
            <span>UTF-8</span>

            <span>LF</span>

            <span>Read Only</span>

            <span className="font-medium text-neutral-400">
                {language}
            </span>
        </div>
    );
}