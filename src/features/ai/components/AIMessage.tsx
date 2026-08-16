import type { ReactNode } from "react";

import type {
    AIMessage as AIMessageData,
} from "../types/AIMessage";

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

export function AIMessage({
    message,
}: AIMessageProps) {
    const isUser =
        message.role ===
        "user";

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
                    </div>
                )}
            </div>
        </div>
    );
}