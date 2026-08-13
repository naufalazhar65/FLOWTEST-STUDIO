import {
    colors,
} from "../../themes";

interface DividerProps {
    vertical?: boolean;

    length?: number | string;

    color?: string;
}

export function Divider({
    vertical = true,
    length,
    color = colors.border,
}: DividerProps) {
    return (
        <div
            style={
                vertical
                    ? {
                        width: 1,

                        height:
                            length ??
                            28,

                        background:
                            color,

                        flexShrink: 0,

                        opacity: 0.8,
                    }
                    : {
                        height: 1,

                        width:
                            length ??
                            "100%",

                        background:
                            color,

                        flexShrink: 0,

                        opacity: 0.8,
                    }
            }
        />
    );
}