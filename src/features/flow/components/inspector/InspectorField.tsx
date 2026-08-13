import type { NodeField } from "../../types/nodeField";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../../themes";

import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Label } from "../../../../components/ui/Label";

interface Props {
    field: NodeField;

    value: unknown;

    onChange(
        value:
            | string
            | number
            | boolean,
    ): void;
}

export function InspectorField({
    field,
    value,
    onChange,
}: Props) {
    return (
        <div
            style={{
                marginBottom:
                    spacing.lg,
            }}
        >
            {field.type !==
                "checkbox" && (
                <Label>
                    {field.label}
                </Label>
            )}

            {field.type ===
                "text" && (
                <Input
                    value={String(
                        value ?? "",
                    )}
                    placeholder={
                        field.placeholder
                    }
                    onChange={(event) =>
                        onChange(
                            event.target
                                .value,
                        )
                    }
                />
            )}

            {field.type ===
                "number" && (
                <Input
                    type="number"
                    value={
                        typeof value ===
                        "number"
                            ? value
                            : ""
                    }
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={
                        field.placeholder
                    }
                    onChange={(event) =>
                        onChange(
                            Number(
                                event.target
                                    .value,
                            ),
                        )
                    }
                />
            )}

            {field.type ===
                "select" && (
                <Select
                    value={String(
                        value ?? "",
                    )}
                    onChange={(event) =>
                        onChange(
                            event.target
                                .value,
                        )
                    }
                >
                    {field.options?.map(
                        (option) => (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        ),
                    )}
                </Select>
            )}

            {field.type ===
                "textarea" && (
                <textarea
                    value={String(
                        value ?? "",
                    )}
                    placeholder={
                        field.placeholder
                    }
                    onChange={(event) =>
                        onChange(
                            event.target
                                .value,
                        )
                    }
                    style={{
                        width: "100%",

                        minHeight: 100,

                        boxSizing:
                            "border-box",

                        resize: "vertical",

                        padding:
                            `${spacing.sm + 2}px ${spacing.md}px`,

                        border:
                            `1px solid ${colors.border}`,

                        borderRadius:
                            radius.md,

                        background:
                            colors.background,

                        color:
                            colors.text,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

                        lineHeight: 1.5,

                        outline: "none",

                        transition:
                            "border-color 150ms ease, box-shadow 150ms ease",
                    }}
                    onFocus={(event) => {
                        event.currentTarget.style
                            .borderColor =
                            colors.focus;

                        event.currentTarget.style
                            .boxShadow =
                            `0 0 0 2px ${colors.selection}`;
                    }}
                    onBlur={(event) => {
                        event.currentTarget.style
                            .borderColor =
                            colors.border;

                        event.currentTarget.style
                            .boxShadow =
                            "none";
                    }}
                />
            )}

            {field.type ===
                "checkbox" && (
                <label
                    style={{
                        display: "flex",

                        alignItems:
                            "center",

                        gap: spacing.sm,

                        minHeight: 34,

                        cursor: "pointer",

                        color:
                            colors.text,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

                        userSelect:
                            "none",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={
                            value === true
                        }
                        onChange={(event) =>
                            onChange(
                                event.target
                                    .checked,
                            )
                        }
                    />

                    <span>
                        {field.label}
                    </span>
                </label>
            )}
        </div>
    );
}