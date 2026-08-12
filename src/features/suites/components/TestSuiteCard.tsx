import {
    CheckCircle2,
    Layers3,
} from "lucide-react";

import type { TestSuite } from "../types/TestSuite";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    suite: TestSuite;
    selected?: boolean;
    onClick?(): void;
}

export function TestSuiteCard({
    suite,
    selected = false,
    onClick,
}: Props) {
    const enabledCount =
        suite.testCases.filter(
            (test) => test.enabled,
        ).length;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "11px 10px",
                border:
                    `1px solid ${selected
                        ? colors.accent
                        : colors.border
                    }`,
                borderRadius: radius.md,
                background:
                    selected
                        ? colors.panelHover
                        : "transparent",
                color: colors.text,
                cursor: "pointer",
                textAlign: "left",
                transition:
                    "background .15s ease, border-color .15s ease",
                boxSizing: "border-box",
            }}
            onMouseEnter={(event) => {
                if (!selected) {
                    event.currentTarget.style.background =
                        colors.panelHover;
                }
            }}
            onMouseLeave={(event) => {
                if (!selected) {
                    event.currentTarget.style.background =
                        "transparent";
                }
            }}
        >
            <div
                style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 7,
                    background:
                        selected
                            ? colors.accent
                            : colors.background,
                    color:
                        selected
                            ? "#FFFFFF"
                            : colors.textSecondary,
                }}
            >
                <Layers3 size={14} strokeWidth={1.8} />
            </div>

            <div
                style={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <div
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        fontWeight: 650,
                        color: colors.text,
                    }}
                >
                    {suite.name}
                </div>

                <div
                    style={{
                        marginTop: 4,
                        color: colors.textMuted,
                        fontSize: 10,
                    }}
                >
                    {suite.testCases.length}{" "}
                    {suite.testCases.length === 1
                        ? "test"
                        : "tests"}
                </div>

                {enabledCount > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 7,
                            color: colors.success,
                            fontSize: 10,
                        }}
                    >
                        <CheckCircle2 size={11} />
                        {enabledCount} enabled
                    </div>
                )}
            </div>
        </button>
    );
}