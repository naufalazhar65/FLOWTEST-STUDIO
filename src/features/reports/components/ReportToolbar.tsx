import {
    ArrowDownAZ,
    ArrowUpAZ,
    Search,
} from "lucide-react";

import type {
    TestReportStatus,
} from "../types/TestReport";

export type ReportFilter =
    | "all"
    | TestReportStatus;

export type ReportSort =
    | "newest"
    | "oldest"
    | "duration-desc"
    | "duration-asc";

interface ReportToolbarProps {
    search: string;

    filter: ReportFilter;

    sort: ReportSort;

    onSearchChange(
        value: string,
    ): void;

    onFilterChange(
        value: ReportFilter,
    ): void;

    onSortChange(
        value: ReportSort,
    ): void;
}

export function ReportToolbar({
    search,
    filter,
    sort,
    onSearchChange,
    onFilterChange,
    onSortChange,
}: ReportToolbarProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 12,
                borderBottom:
                    "1px solid #30363D",
                background: "#0D1117",
            }}
        >
            {/* Search */}
            <div
                style={{
                    position: "relative",
                    flex: 1,
                    minWidth: 180,
                }}
            >
                <Search
                    size={15}
                    color="#6E7681"
                    style={{
                        position:
                            "absolute",
                        left: 10,
                        top: "50%",
                        transform:
                            "translateY(-50%)",
                        pointerEvents:
                            "none",
                    }}
                />

                <input
                    value={search}
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value,
                        )
                    }
                    placeholder="Search reports..."
                    style={{
                        width: "100%",
                        height: 34,
                        boxSizing:
                            "border-box",
                        padding:
                            "0 10px 0 32px",
                        border:
                            "1px solid #30363D",
                        borderRadius: 7,
                        outline: "none",
                        background:
                            "#161B22",
                        color: "#E6EDF3",
                        fontSize: 12,
                    }}
                    onFocus={(event) => {
                        event.currentTarget.style.borderColor =
                            "#58A6FF";
                    }}
                    onBlur={(event) => {
                        event.currentTarget.style.borderColor =
                            "#30363D";
                    }}
                />
            </div>

            {/* Filter */}
            <select
                value={filter}
                onChange={(event) =>
                    onFilterChange(
                        event.target
                            .value as ReportFilter,
                    )
                }
                style={selectStyle}
            >
                <option value="all">
                    All Status
                </option>

                <option value="passed">
                    Passed
                </option>

                <option value="failed">
                    Failed
                </option>

                <option value="stopped">
                    Stopped
                </option>
            </select>

            {/* Sort */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                {sort ===
                "newest" ? (
                    <ArrowDownAZ
                        size={15}
                        color="#8B949E"
                    />
                ) : (
                    <ArrowUpAZ
                        size={15}
                        color="#8B949E"
                    />
                )}

                <select
                    value={sort}
                    onChange={(event) =>
                        onSortChange(
                            event.target
                                .value as ReportSort,
                        )
                    }
                    style={selectStyle}
                >
                    <option value="newest">
                        Newest
                    </option>

                    <option value="oldest">
                        Oldest
                    </option>

                    <option value="duration-desc">
                        Longest Duration
                    </option>

                    <option value="duration-asc">
                        Shortest Duration
                    </option>
                </select>
            </div>
        </div>
    );
}

const selectStyle: React.CSSProperties =
    {
        height: 34,

        padding:
            "0 28px 0 10px",

        border:
            "1px solid #30363D",

        borderRadius: 7,

        outline: "none",

        background: "#161B22",

        color: "#C9D1D9",

        fontSize: 12,

        cursor: "pointer",

        colorScheme: "dark",
    };