import { Search } from "lucide-react";

import {
    colors,
    radius,
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

                gap: 10,

                padding: "0 12px",

                height: 38,

                border: `1px solid ${colors.border}`,

                background: colors.panel,

                borderRadius: radius.md,
            }}
        >
            <Search
                size={16}
                color={colors.textSecondary}
            />

            <input
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value,
                    )
                }
                placeholder={placeholder}
                style={{
                    flex: 1,

                    background: "transparent",

                    border: 0,

                    outline: 0,

                    color: colors.text,

                    fontSize: 13,
                }}
            />
        </div>
    );
}