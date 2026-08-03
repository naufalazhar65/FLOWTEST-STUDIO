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
                items-center
                justify-end
                gap-4
                border-t
                border-neutral-800
                bg-neutral-900
                px-3
                py-1.5
                text-[11px]
                text-neutral-500
            "
        >
            <span>UTF-8</span>

            <span>{language}</span>
        </div>
    );
}