import { Search } from "lucide-react";

import type { TestSuite } from "../types/TestSuite";

import { TestSuiteCard } from "./TestSuiteCard";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    suites: TestSuite[];
    selectedSuiteId: string | null;
    search: string;
    onSearchChange(
        value: string,
    ): void;
    onSelect(id: string): void;
}

export function TestSuiteList({
    suites,
    selectedSuiteId,
    search,
    onSearchChange,
    onSelect,
}: Props) {
    return (
        <aside
            style={{
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                background: colors.panel,
                borderRight:
                    `1px solid ${colors.border}`,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: 12,
                    borderBottom:
                        `1px solid ${colors.border}`,
                }}
            >
                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <Search
                        size={14}
                        style={{
                            position:
                                "absolute",
                            left: 10,
                            top: "50%",
                            transform:
                                "translateY(-50%)",
                            color:
                                colors.textMuted,
                        }}
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value,
                            )
                        }
                        placeholder="Search suites..."
                        aria-label="Search suites"
                        style={{
                            width: "100%",
                            height: 32,
                            boxSizing:
                                "border-box",
                            padding:
                                "0 10px 0 30px",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.md,
                            background:
                                colors.background,
                            color: colors.text,
                            outline: "none",
                            fontSize: 12,
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    padding: 10,
                }}
            >
                {suites.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: 7,
                        }}
                    >
                        {suites.map((suite) => (
                            <TestSuiteCard
                                key={suite.id}
                                suite={suite}
                                selected={
                                    suite.id ===
                                    selectedSuiteId
                                }
                                onClick={() =>
                                    onSelect(
                                        suite.id,
                                    )
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            padding: 20,
                            textAlign: "center",
                            color:
                                colors.textMuted,
                            fontSize: 11,
                        }}
                    >
                        No suites found.
                    </div>
                )}
            </div>
        </aside>
    );
}