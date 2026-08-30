import {
    History,
    RotateCcw,
    Trash2,
} from "lucide-react";

import {
    useAIAuditStore,
} from "../store/useAIAuditStore";

function formatTime(
    timestamp: number,
): string {
    return new Date(
        timestamp,
    ).toLocaleTimeString(
        [],
        {
            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",
        },
    );
}

export function AIAuditPanel() {
    const records =
        useAIAuditStore(
            (state) =>
                state.records,
        );

    const rollback =
        useAIAuditStore(
            (state) =>
                state.rollback,
        );

    const clearHistory =
        useAIAuditStore(
            (state) =>
                state.clearHistory,
        );

    if (
        records.length ===
        0
    ) {
        return null;
    }

    return (
        <div
            style={{
                marginTop:
                    12,

                paddingTop:
                    12,

                borderTop:
                    "1px solid #30363D",
            }}
        >
            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    marginBottom:
                        8,
                }}
            >
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 7,

                        color:
                            "#E6EDF3",

                        fontSize:
                            12,

                        fontWeight:
                            600,
                    }}
                >
                    <History
                        size={
                            14
                        }
                        color="#A371F7"
                    />
                    AI Applied Actions
                </div>

                <button
                    type="button"
                    onClick={
                        clearHistory
                    }
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 5,

                        padding:
                            "4px 8px",

                        border:
                            "1px solid #30363D",

                        borderRadius:
                            5,

                        background:
                            "transparent",

                        color:
                            "#8B949E",

                        fontSize:
                            11,

                        cursor:
                            "pointer",
                    }}
                >
                    <Trash2
                        size={
                            12
                        }
                    />
                    Clear
                </button>
            </div>

            <div
                style={{
                    display:
                        "flex",

                    flexDirection:
                        "column",

                    gap: 8,
                }}
            >
                {records.map(
                    (
                        record,
                    ) => {
                        const undone =
                            record.status ===
                            "rolledBack";

                        return (
                            <div
                                key={
                                    record.id
                                }
                                style={{
                                    border:
                                        "1px solid #30363D",

                                    borderRadius:
                                        8,

                                    padding:
                                        "9px 10px",

                                    background:
                                        "#161B22",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",

                                        justifyContent:
                                            "space-between",

                                        gap: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            color:
                                                undone
                                                ? "#8B949E"
                                                : "#E6EDF3",

                                            fontSize:
                                                12,

                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {
                                            record.summary
                                        }
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                undone
                                                ? "#8B949E"
                                                : "#58A6FF",

                                            fontSize:
                                                10,

                                            textTransform:
                                                "capitalize",

                                            flexShrink:
                                                0,
                                        }}
                                    >
                                        {
                                            undone
                                            ? "Rolled back"
                                            : record.kind
                                        }
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            4,

                                        color:
                                            "#8B949E",

                                        fontSize:
                                            11,

                                        lineHeight:
                                            1.4,
                                    }}
                                >
                                    {
                                        formatTime(
                                            record.createdAt,
                                        )
                                    }
                                    {" · "}
                                    {
                                        record
                                            .diff
                                            .summary
                                            .addedNodes
                                    }
                                    {" new · "}
                                    {
                                        record
                                            .diff
                                            .summary
                                            .modifiedNodes
                                    }
                                    {" modified · "}
                                    {
                                        record
                                            .diff
                                            .summary
                                            .removedNodes
                                    }
                                    {" removed"}
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        marginTop:
                                            8,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            () =>
                                                rollback(
                                                    record.id,
                                                )
                                        }
                                        disabled={
                                            undone
                                        }
                                        style={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 5,

                                            padding:
                                                "4px 9px",

                                            border: "1px solid",
                                            borderColor:
                                                undone
                                                ? "#30363D"
                                                : "#8957E5",

                                            borderRadius:
                                                5,

                                            background:
                                                undone
                                                ? "transparent"
                                                : "rgba(137,87,229,.14)",

                                            color:
                                                undone
                                                ? "#8B949E"
                                                : "#C9A7FF",

                                            fontSize:
                                                11,

                                            fontWeight:
                                                600,

                                            cursor:
                                                undone
                                                ? "not-allowed"
                                                : "pointer",
                                        }}
                                    >
                                        <RotateCcw
                                            size={
                                                12
                                            }
                                        />
                                        {
                                            undone
                                            ? "Undone"
                                            : "Undo"
                                        }
                                    </button>
                                </div>
                            </div>
                        );
                    },
                )}
            </div>
        </div>
    );
}
