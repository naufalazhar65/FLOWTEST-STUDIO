import type { ElementInfo } from "../types/ElementInfo";

interface ElementHighlightProps {
    element: ElementInfo | null;
}

interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

function parseBounds(
    value: string | undefined,
): Bounds | null {
    if (!value) {
        return null;
    }

    const match = value.match(
        /^\[(\d+),(\d+)\]\[(\d+),(\d+)\]$/,
    );

    if (!match) {
        return null;
    }

    const [, left, top, right, bottom] =
        match;

    return {
        left: Number(left),
        top: Number(top),
        right: Number(right),
        bottom: Number(bottom),
    };
}

export function ElementHighlight({
    element,
}: ElementHighlightProps) {
    if (!element) {
        return null;
    }

    const bounds =
        parseBounds(element.bounds);

    if (!bounds) {
        return (
            <div
                style={{
                    padding: "10px 12px",
                    fontSize: 11,
                    color: "#8B949E",
                    borderTop:
                        "1px solid #30363D",
                }}
            >
                Bounds are not available for
                this element.
            </div>
        );
    }

    const width =
        bounds.right - bounds.left;

    const height =
        bounds.bottom - bounds.top;

    return (
        <div
            style={{
                borderTop:
                    "1px solid #30363D",
                padding: "10px 12px",
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    color: "#8B949E",
                    marginBottom: 8,
                }}
            >
                Element Bounds
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: 6,
                    fontSize: 11,
                }}
            >
                <div>
                    X: {bounds.left}
                </div>

                <div>
                    Y: {bounds.top}
                </div>

                <div>
                    Width: {width}
                </div>

                <div>
                    Height: {height}
                </div>
            </div>

            <div
                style={{
                    marginTop: 10,
                    position: "relative",
                    height: 120,
                    border:
                        "1px solid #30363D",
                    borderRadius: 6,
                    background:
                        "#161B22",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position:
                            "absolute",
                        left: `${bounds.left
                            }px`,
                        top: `${bounds.top
                            }px`,
                        width: `${width
                            }px`,
                        height: `${height
                            }px`,
                        maxWidth: "100%",
                        maxHeight: "100%",
                        border:
                            "2px solid #58A6FF",
                        background:
                            "rgba(88,166,255,0.15)",
                        boxSizing:
                            "border-box",
                    }}
                />
            </div>
        </div>
    );
}