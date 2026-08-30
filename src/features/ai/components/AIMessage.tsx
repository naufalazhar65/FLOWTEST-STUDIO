import {
    useState,
    type ReactNode,
} from "react";

import {
    CheckCircle2,
    Loader2,
    Wrench,
} from "lucide-react";

import {
    useAIStore,
} from "../store/useAIStore";

import type {
    AIMessage as AIMessageData,
} from "../types/AIMessage";

import type {
    AIQARecommendation,
} from "../types/AIRequest";

interface AIMessageProps {
    message: AIMessageData;
}

function renderInlineMarkdown(
    text: string,
): ReactNode {
    const parts =
        text.split(
            /(\*\*[^*]+\*\*)/g,
        );

    return parts.map(
        (
            part,
            index,
        ) => {
            if (
                part.startsWith(
                    "**",
                ) &&
                part.endsWith(
                    "**",
                )
            ) {
                return (
                    <strong
                        key={
                            `${part}-${index}`
                        }
                    >
                        {part.slice(
                            2,
                            -2,
                        )}
                    </strong>
                );
            }

            return (
                <span
                    key={
                        `${part}-${index}`
                    }
                >
                    {part}
                </span>
            );
        },
    );
}

function renderMessageContent(
    content: string,
): ReactNode[] {
    const lines =
        content.split("\n");

    const rendered: ReactNode[] =
        [];

    let bulletItems: string[] =
        [];

    function flushBullets() {
        if (
            bulletItems.length ===
            0
        ) {
            return;
        }

        rendered.push(
            <ul
                key={`ul-${rendered.length}`}
                style={{
                    margin:
                        "8px 0",

                    paddingLeft:
                        20,
                }}
            >
                {bulletItems.map(
                    (
                        item,
                        index,
                    ) => (
                        <li
                            key={
                                `${item}-${index}`
                            }
                            style={{
                                marginBottom:
                                    4,

                                paddingLeft:
                                    2,
                            }}
                        >
                            {renderInlineMarkdown(
                                item,
                            )}
                        </li>
                    ),
                )}
            </ul>,
        );

        bulletItems = [];
    }

    lines.forEach(
        (
            line,
            index,
        ) => {
            const trimmed =
                line.trim();

            if (!trimmed) {
                flushBullets();

                rendered.push(
                    <div
                        key={`space-${index}`}
                        style={{
                            height: 8,
                        }}
                    />,
                );

                return;
            }

            if (
                trimmed.startsWith(
                    "## ",
                )
            ) {
                flushBullets();

                rendered.push(
                    <h3
                        key={`heading-${index}`}
                        style={{
                            margin:
                                "12px 0 8px",

                            color:
                                "#F0F6FC",

                            fontSize: 15,

                            lineHeight:
                                1.35,

                            fontWeight:
                                700,
                        }}
                    >
                        {renderInlineMarkdown(
                            trimmed.slice(
                                3,
                            ),
                        )}
                    </h3>,
                );

                return;
            }

            if (
                trimmed.startsWith(
                    "### ",
                )
            ) {
                flushBullets();

                rendered.push(
                    <h4
                        key={`subheading-${index}`}
                        style={{
                            margin:
                                "10px 0 6px",

                            color:
                                "#E6EDF3",

                            fontSize: 14,

                            lineHeight:
                                1.35,

                            fontWeight:
                                700,
                        }}
                    >
                        {renderInlineMarkdown(
                            trimmed.slice(
                                4,
                            ),
                        )}
                    </h4>,
                );

                return;
            }

            const bulletMatch =
                trimmed.match(
                    /^[-*]\s+(.+)$/,
                );

            if (bulletMatch) {
                bulletItems.push(
                    bulletMatch[1],
                );

                return;
            }

            const numberedMatch =
                trimmed.match(
                    /^(\d+)\.\s+(.+)$/,
                );

            if (
                numberedMatch
            ) {
                flushBullets();

                rendered.push(
                    <div
                        key={`numbered-${index}`}
                        style={{
                            display:
                                "flex",

                            gap: 8,

                            margin:
                                "4px 0",

                            alignItems:
                                "flex-start",
                        }}
                    >
                        <span
                            style={{
                                flexShrink:
                                    0,

                                color:
                                    "#8B949E",

                                minWidth:
                                    20,

                                fontWeight:
                                    600,
                            }}
                        >
                            {
                                numberedMatch[1]
                            }.
                        </span>

                        <span
                            style={{
                                minWidth:
                                    0,
                            }}
                        >
                            {renderInlineMarkdown(
                                numberedMatch[2],
                            )}
                        </span>
                    </div>,
                );

                return;
            }

            flushBullets();

            rendered.push(
                <p
                    key={`paragraph-${index}`}
                    style={{
                        margin:
                            "6px 0",

                        color:
                            "#E6EDF3",

                        lineHeight:
                            1.55,
                    }}
                >
                    {renderInlineMarkdown(
                        line,
                    )}
                </p>,
            );
        },
    );

    flushBullets();

    return rendered;
}

function getPriorityColor(
    priority:
        AIQARecommendation["priority"],
): string {
    if (
        priority ===
        "critical"
    ) {
        return "#F85149";
    }

    if (
        priority ===
        "high"
    ) {
        return "#D29922";
    }

    if (
        priority ===
        "medium"
    ) {
        return "#58A6FF";
    }

    return "#8B949E";
}

function getPriorityLabel(
    priority:
        AIQARecommendation["priority"],
): string {
    return priority
        .charAt(0)
        .toUpperCase() +
        priority.slice(1);
}

function QARecommendationCard({
    recommendation,
}: {
    recommendation:
        AIQARecommendation;
}) {
    const requestQAFix =
        useAIStore(
            (state) =>
                state.requestQAFix,
        );

    const [
        isApplying,
        setIsApplying,
    ] = useState(false);

    const [
        applied,
        setApplied,
    ] = useState(false);

    const [
        localError,
        setLocalError,
    ] = useState<
        string | null
    >(null);

    const suggestedFix =
        recommendation.suggestedFix;

    async function handleApplyFix() {
        if (
            !suggestedFix ||
            isApplying ||
            applied
        ) {
            return;
        }

        setIsApplying(
            true,
        );

        setLocalError(
            null,
        );

        try {
            await requestQAFix(
                recommendation,
            );

            setApplied(
                true,
            );
        } catch (
            error
        ) {
            setLocalError(
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    ),
            );
        } finally {
            setIsApplying(
                false,
            );
        }
    }

    const priorityColor =
        getPriorityColor(
            recommendation.priority,
        );

    return (
        <div
            style={{
                marginTop: 10,

                padding: 10,

                border:
                    "1px solid #30363D",

                borderRadius: 8,

                background:
                    "#0D1117",
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

                    gap: 8,
                }}
            >
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 6,

                        minWidth: 0,
                    }}
                >
                    <span
                        style={{
                            width: 7,

                            height: 7,

                            flexShrink: 0,

                            borderRadius:
                                "50%",

                            background:
                                priorityColor,
                        }}
                    />

                    <span
                        style={{
                            color:
                                priorityColor,

                            fontSize: 10,

                            fontWeight:
                                700,

                            textTransform:
                                "uppercase",

                            letterSpacing:
                                "0.04em",
                        }}
                    >
                        {
                            getPriorityLabel(
                                recommendation.priority,
                            )
                        }
                    </span>
                </div>

                <span
                    style={{
                        color:
                            "#6E7681",

                        fontSize: 10,
                    }}
                >
                    {
                        recommendation.category
                    }
                </span>
            </div>

            <div
                style={{
                    marginTop: 7,

                    color:
                        "#E6EDF3",

                    fontSize: 12,

                    fontWeight:
                        600,
                }}
            >
                {
                    recommendation.title
                }
            </div>

            {recommendation.nodeId && (
                <div
                    style={{
                        marginTop: 4,

                        color:
                            "#6E7681",

                        fontSize: 10,

                        fontFamily:
                            "monospace",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    Node:{" "}
                    {
                        recommendation.nodeId
                    }
                </div>
            )}

            <div
                style={{
                    marginTop: 7,

                    color:
                        "#8B949E",

                    fontSize: 11,

                    lineHeight:
                        1.45,
                }}
            >
                {
                    recommendation.description
                }
            </div>

            {recommendation.recommendation && (
                <div
                    style={{
                        marginTop: 7,

                        color:
                            "#8B949E",

                        fontSize: 11,

                        lineHeight:
                            1.45,
                    }}
                >
                    {
                        recommendation.recommendation
                    }
                </div>
            )}

            {suggestedFix && (
                <div
                    style={{
                        marginTop: 10,

                        paddingTop: 9,

                        borderTop:
                            "1px solid #21262D",
                    }}
                >
                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: 6,

                            marginBottom:
                                7,

                            color:
                                "#A371F7",

                            fontSize: 10,

                            fontWeight:
                                700,

                            textTransform:
                                "uppercase",

                            letterSpacing:
                                "0.04em",
                        }}
                    >
                        <Wrench
                            size={
                                12
                            }
                        />

                        Suggested Fix
                    </div>

                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "space-between",

                            gap: 8,
                        }}
                    >
                        <span
                            style={{
                                color:
                                    "#E6EDF3",

                                fontSize:
                                    11,

                                fontFamily:
                                    "monospace",
                            }}
                        >
                            {
                                suggestedFix.type
                            }
                        </span>

                        <button
                            type="button"
                            onClick={
                                handleApplyFix
                            }
                            disabled={
                                isApplying ||
                                applied
                            }
                            style={{
                                display:
                                    "inline-flex",

                                alignItems:
                                    "center",

                                gap: 5,

                                padding:
                                    "6px 9px",

                                border:
                                    applied
                                        ? "1px solid #238636"
                                        : "1px solid #8957E5",

                                borderRadius:
                                    6,

                                background:
                                    applied
                                        ? "#12261A"
                                        : "#2D1F45",

                                color:
                                    applied
                                        ? "#3FB950"
                                        : "#D2A8FF",

                                fontSize:
                                    10,

                                fontWeight:
                                    600,

                                cursor:
                                    isApplying ||
                                    applied
                                        ? "default"
                                        : "pointer",

                                opacity:
                                    isApplying
                                        ? 0.7
                                        : 1,
                            }}
                        >
                            {isApplying ? (
                                <>
                                    <Loader2
                                        size={
                                            11
                                        }
                                        style={{
                                            animation:
                                                "spin 1s linear infinite",
                                        }}
                                    />

                                    Preparing...
                                </>
                            ) : applied ? (
                                <>
                                    <CheckCircle2
                                        size={
                                            11
                                        }
                                    />

                                    Fix Ready
                                </>
                            ) : (
                                <>
                                    <Wrench
                                        size={
                                            11
                                        }
                                    />

                                    Apply Suggested Fix
                                </>
                            )}
                        </button>
                    </div>

                    {localError && (
                        <div
                            style={{
                                marginTop:
                                    7,

                                padding:
                                    "6px 8px",

                                border:
                                    "1px solid #3D1F1F",

                                borderRadius:
                                    5,

                                background:
                                    "#1A0F0F",

                                color:
                                    "#F85149",

                                fontSize:
                                    10,

                                lineHeight:
                                    1.4,
                            }}
                        >
                            {
                                localError
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function AIMessage({
    message,
}: AIMessageProps) {
    const isUser =
        message.role ===
        "user";

    const recommendations =
        message.qaRecommendations ??
        [];

    return (
        <div
            style={{
                display:
                    "flex",

                justifyContent:
                    isUser
                        ? "flex-end"
                        : "flex-start",

                marginBottom:
                    12,
            }}
        >
            <div
                style={{
                    maxWidth:
                        "90%",

                    padding:
                        "10px 12px",

                    borderRadius:
                        10,

                    background:
                        isUser
                            ? "#238636"
                            : "#161B22",

                    border:
                        isUser
                            ? "1px solid #2EA043"
                            : "1px solid #30363D",

                    color:
                        "#E6EDF3",

                    fontSize: 13,

                    lineHeight:
                        1.5,

                    overflowWrap:
                        "anywhere",
                }}
            >
                {isUser ? (
                    <div
                        style={{
                            whiteSpace:
                                "pre-wrap",
                        }}
                    >
                        {
                            message.content
                        }
                    </div>
                ) : (
                    <div>
                        {renderMessageContent(
                            message.content,
                        )}

                        {message.clarification &&
                            message.clarification.candidates &&
                            message.clarification.candidates.length >
                            0 && (
                            <div
                                style={{
                                    marginTop:
                                        12,

                                    paddingTop:
                                        10,

                                    borderTop:
                                        "1px solid #30363D",
                                }}
                            >
                                <div
                                    style={{
                                        color:
                                            "#A371F7",

                                        fontSize:
                                            11,

                                        fontWeight:
                                            700,

                                        marginBottom:
                                            8,

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",
                                    }}
                                >
                                    Pilih Kandidat Node:
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        gap: 6,
                                    }}
                                >
                                    {message.clarification.candidates.map(
                                        (
                                            candidate,
                                            index,
                                        ) => {
                                            const ordinalLabel =
                                                index ===
                                                    0
                                                    ? "Yang pertama"
                                                    : index ===
                                                        1
                                                        ? "Yang kedua"
                                                        : index ===
                                                            2
                                                            ? "Yang ketiga"
                                                            : `Yang ke-${index + 1}`;

                                            return (
                                                <button
                                                    key={
                                                        candidate.nodeId ??
                                                        index
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        useAIStore
                                                            .getState()
                                                            .sendMessage(
                                                                ordinalLabel,
                                                            );
                                                    }}
                                                    style={{
                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "space-between",

                                                        padding:
                                                            "7px 10px",

                                                        border:
                                                            "1px solid #30363D",

                                                        borderRadius:
                                                            6,

                                                        background:
                                                            "#0D1117",

                                                        color:
                                                            "#E6EDF3",

                                                        fontSize:
                                                            11,

                                                        textAlign:
                                                            "left",

                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    <div>
                                                        <strong
                                                            style={{
                                                                color:
                                                                    "#A371F7",
                                                                marginRight:
                                                                    6,
                                                            }}
                                                        >
                                                            {
                                                                index +
                                                                1
                                                            }
                                                            .
                                                        </strong>

                                                        {candidate.title ??
                                                            candidate.action ??
                                                            "Node"}{" "}
                                                        <span
                                                            style={{
                                                                color:
                                                                    "#8B949E",

                                                                fontSize:
                                                                    10,

                                                                fontFamily:
                                                                    "monospace",
                                                            }}
                                                        >
                                                            (
                                                            {
                                                                candidate.nodeId
                                                            }
                                                            )
                                                        </span>
                                                    </div>

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                10,

                                                            color:
                                                                "#8957E5",

                                                            fontWeight:
                                                                600,
                                                        }}
                                                    >
                                                        Pilih &rarr;
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        )}

                        {recommendations.length >
                            0 && (
                            <div
                                style={{
                                    marginTop:
                                        12,

                                    paddingTop:
                                        10,

                                    borderTop:
                                        "1px solid #30363D",
                                }}
                            >
                                <div
                                    style={{
                                        color:
                                            "#E6EDF3",

                                        fontSize:
                                            12,

                                        fontWeight:
                                            700,
                                    }}
                                >
                                    QA Recommendations
                                </div>

                                {recommendations.map(
                                    (
                                        recommendation,
                                    ) => (
                                        <QARecommendationCard
                                            key={
                                                recommendation.id
                                            }
                                            recommendation={
                                                recommendation
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}