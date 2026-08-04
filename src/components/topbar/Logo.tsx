// import { GitBranch } from "lucide-react";

export function Logo() {
    return (
        <div
            className="
                flex
                cursor-default
                items-center
                gap-3
                select-none
            "
        >
            <div
    className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        bg-gradient-to-br
        from-blue-500
        to-indigo-600
        text-lg
        font-black
        text-white
        shadow-md
        shadow-blue-500/20
    "
>
    F
</div>

            <div className="leading-tight">

                <div
                    className="
                        text-[16px]
                        font-bold
                        tracking-tight
                        text-white
                    "
                >
                    FlowTest Studio
                </div>

                <div
                    className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-neutral-500
                    "
                >
                    Visual Mobile Automation IDE
                </div>

            </div>
        </div>
    );
}