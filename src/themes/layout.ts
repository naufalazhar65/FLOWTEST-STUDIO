import type { CSSProperties } from "react";

export const layout: Record<string, CSSProperties> = {
    row: {
        display: "flex",
        alignItems: "center",
    },

    column: {
        display: "flex",
        flexDirection: "column",
    },

    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    between: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },

    panel: {
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
    },

    fill: {
        flex: 1,
        minHeight: 0,
    },

    scrollY: {
        overflowY: "auto",
        overflowX: "hidden",
    },

    scrollX: {
        overflowX: "auto",
        overflowY: "hidden",
    },
};