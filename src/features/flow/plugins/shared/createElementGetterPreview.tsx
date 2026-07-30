import type { ReactNode } from "react";

interface CreateElementGetterPreviewOptions {
    title: string;

    locatorStrategy: string;

    locator: string;

    variableName: string;
}

export function createElementGetterPreview(
    options: CreateElementGetterPreviewOptions,
): ReactNode {
    return (
        <>
            <div
                style={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 14,
                }}
            >
                {options.title}
            </div>

            <div
                style={{
                    color: "#94A3B8",
                    fontSize: 13,
                }}
            >
                {options.locatorStrategy}={options.locator || "-"}
            </div>

            <div
                style={{
                    color: "#64748B",
                    fontSize: 12,
                }}
            >
                → {options.variableName || "(variable)"}
            </div>
        </>
    );
}