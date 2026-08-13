import { Search } from "lucide-react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

interface Props {
    value: string;

    onChange(
        value: string,
    ): void;

    placeholder?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
}: Props) {
    return (
        <div
            style={{
                display: "flex",

                alignItems: "center",

                gap: spacing.sm + 2,

                width: "100%",

                height: 38,

                boxSizing:
                    "border-box",

                padding:
                    `0 ${spacing.md}px`,

                border:
                    `1px solid ${colors.border}`,

                background:
                    colors.panel,

                borderRadius:
                    radius.md,

                transition:
                    `border-color ${animation.fast}, box-shadow ${animation.fast}`,
            }}
        >
            <Search
                size={16}
                color={
                    colors.textSecondary
                }
                strokeWidth={2}
            />

            <input
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value,
                    )
                }
                placeholder={
                    placeholder
                }
                style={{
                    flex: 1,

                    minWidth: 0,

                    height: "100%",

                    padding: 0,

                    background:
                        "transparent",

                    border: 0,

                    outline: 0,

                    color:
                        colors.text,

                    fontSize:
                        typography.body
                            .fontSize,

                    fontWeight:
                        typography.body
                            .fontWeight,
                }}
                onFocus={(event) => {
                    const container =
                        event.currentTarget
                            .parentElement;

                    if (!container) {
                        return;
                    }

                    container.style
                        .borderColor =
                        colors.focus;

                    container.style
                        .boxShadow =
                        `0 0 0 2px ${colors.selection}`;
                }}
                onBlur={(event) => {
                    const container =
                        event.currentTarget
                            .parentElement;

                    if (!container) {
                        return;
                    }

                    container.style
                        .borderColor =
                        colors.border;

                    container.style
                        .boxShadow =
                        "none";
                }}
            />
        </div>
    );
}