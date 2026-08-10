import {
    Check,
    Copy,
    Loader2,
    Play,
    Plus,
    Star,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { LocatorCandidate } from "../types/LocatorCandidate";

import { testLocator } from "../services/testLocator";
import type { LocatorStrategy } from "../../execution/types/LocatorStrategy";
import { useFlowStore } from "../../flow/store/useFlowStore";
import { AddInputDialog } from "./AddInputDialog";

interface Props {
    locators: LocatorCandidate[];
}

interface TestResult {
    found: boolean;
    error?: string;
}

export function LocatorList({
    locators,
}: Props) {
    const addNodeWithLocator =
        useFlowStore(
            (state) =>
                state.addNodeWithLocator,
        );

    const [copied, setCopied] =
        useState<string | null>(null);

    const [testing, setTesting] =
        useState<string | null>(null);

    const [testResults, setTestResults] =
        useState<
            Record<string, TestResult>
        >({});

    const [
        inputLocator,
        setInputLocator,
    ] = useState<
        LocatorCandidate | null
    >(null);

    useEffect(() => {
        if (!copied) {
            return;
        }

        const timer =
            window.setTimeout(() => {
                setCopied(null);
            }, 1500);

        return () =>
            window.clearTimeout(timer);
    }, [copied]);

    async function handleTestLocator(
        locator: LocatorCandidate,
    ) {
        const key = getLocatorKey(
            locator,
        );

        setTesting(key);

        try {
            const result =
                await testLocator(
                    locator,
                );

            setTestResults(
                (current) => ({
                    ...current,
                    [key]: {
                        found: result.found,
                        error: result.error,
                    },
                }),
            );
        } finally {
            setTesting(null);
        }
    }

    async function copyLocator(
        locator: LocatorCandidate,
    ) {
        try {
            await navigator.clipboard.writeText(
                locator.value,
            );

            setCopied(
                locator.strategy,
            );
        } catch (error) {
            console.error(
                "Failed to copy locator:",
                error,
            );
        }
    }

    function handleAddTap(
        locator: LocatorCandidate,
    ) {
        const strategy =
            toFlowLocatorStrategy(
                locator.strategy,
            );

        addNodeWithLocator(
            "tap",
            strategy,
            locator.value,
        );
    }

    if (locators.length === 0) {
        return (
            <div
                style={{
                    padding: 16,
                    color: "#8B949E",
                    fontSize: 12,
                }}
            >
                No locator candidates
                available.
            </div>
        );
    }

    function handleAddInput(
        locator: LocatorCandidate,
    ) {
        setInputLocator(locator);
    }

    function handleConfirmInput(
        text: string,
    ) {
        if (!inputLocator) {
            return;
        }

        const strategy =
            toFlowLocatorStrategy(
                inputLocator.strategy,
            );

        addNodeWithLocator(
            "input",
            strategy,
            inputLocator.value,
            text,
        );

        setInputLocator(null);
    }

    function handleCancelInput() {
        setInputLocator(null);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {locators.map(
                (locator) => {
                    const key =
                        getLocatorKey(
                            locator,
                        );

                    const result =
                        testResults[key];

                    const isTesting =
                        testing === key;

                    return (
                        <div
                            key={key}
                            style={{
                                border:
                                    "1px solid #30363D",
                                borderRadius: 8,
                                overflow:
                                    "hidden",
                                background:
                                    "#161B22",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    padding:
                                        "8px 10px",
                                    borderBottom:
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
                                        minWidth: 0,
                                    }}
                                >
                                    {locator.recommended && (
                                        <Star
                                            size={
                                                12
                                            }
                                            fill="currentColor"
                                            color="#F59E0B"
                                            style={{
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}

                                    <span
                                        style={{
                                            color:
                                                "#F0F6FC",
                                            fontSize:
                                                12,
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {formatStrategy(
                                            locator.strategy,
                                        )}
                                    </span>

                                    {locator.recommended && (
                                        <span
                                            style={{
                                                padding:
                                                    "2px 6px",
                                                borderRadius:
                                                    4,
                                                background:
                                                    "rgba(245,158,11,.12)",
                                                color:
                                                    "#F59E0B",
                                                fontSize:
                                                    9,
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            RECOMMENDED
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <button
                                        type="button"
                                        disabled={
                                            testing !==
                                            null
                                        }
                                        onClick={() =>
                                            void handleTestLocator(
                                                locator,
                                            )
                                        }
                                        title="Test locator"
                                        style={{
                                            display:
                                                "grid",
                                            placeItems:
                                                "center",
                                            width: 28,
                                            height: 28,
                                            padding: 0,
                                            border:
                                                "none",
                                            borderRadius:
                                                6,
                                            background:
                                                "transparent",
                                            color:
                                                isTesting
                                                    ? "#A78BFA"
                                                    : "#8B949E",
                                            cursor:
                                                testing !==
                                                    null
                                                    ? "default"
                                                    : "pointer",
                                            opacity:
                                                testing !==
                                                    null &&
                                                    !isTesting
                                                    ? 0.5
                                                    : 1,
                                        }}
                                    >
                                        {isTesting ? (
                                            <Loader2
                                                size={
                                                    14
                                                }
                                                style={{
                                                    animation:
                                                        "spin 1s linear infinite",
                                                }}
                                            />
                                        ) : (
                                            <Play
                                                size={
                                                    13
                                                }
                                            />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void copyLocator(
                                                locator,
                                            )
                                        }
                                        title="Copy locator"
                                        style={{
                                            display:
                                                "grid",
                                            placeItems:
                                                "center",
                                            width: 28,
                                            height: 28,
                                            padding: 0,
                                            border:
                                                "none",
                                            borderRadius:
                                                6,
                                            background:
                                                "transparent",
                                            color:
                                                "#8B949E",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        {copied ===
                                            locator.strategy ? (
                                            <Check
                                                size={
                                                    14
                                                }
                                                color="#3FB950"
                                            />
                                        ) : (
                                            <Copy
                                                size={
                                                    14
                                                }
                                            />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddTap(
                                                locator,
                                            )
                                        }
                                        title="Add Tap node"
                                        style={{
                                            display: "grid",
                                            placeItems: "center",
                                            width: 28,
                                            height: 28,
                                            padding: 0,
                                            border: "none",
                                            borderRadius: 6,
                                            background:
                                                "transparent",
                                            color: "#8B949E",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Plus
                                            size={14}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddInput(locator)
                                        }
                                        title="Add Input node"
                                        style={{
                                            display: "grid",
                                            placeItems: "center",
                                            width: 28,
                                            height: 28,
                                            padding: 0,
                                            border: "none",
                                            borderRadius: 6,
                                            background:
                                                "transparent",
                                            color: "#8B949E",
                                            cursor: "pointer",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                    >
                                        IN
                                    </button>
                                </div>
                            </div>

                            {/* Locator value */}
                            <div
                                style={{
                                    padding: 10,
                                }}
                            >
                                <div
                                    style={{
                                        padding:
                                            "8px 10px",
                                        borderRadius:
                                            6,
                                        background:
                                            "#0D1117",
                                        color:
                                            "#C9D1D9",
                                        fontFamily:
                                            "monospace",
                                        fontSize:
                                            11,
                                        lineHeight:
                                            1.5,
                                        wordBreak:
                                            "break-all",
                                    }}
                                >
                                    {
                                        locator.value
                                    }
                                </div>

                                {/* Reason */}
                                {locator.reason && (
                                    <div
                                        style={{
                                            marginTop:
                                                7,
                                            color:
                                                "#6E7681",
                                            fontSize:
                                                10,
                                            lineHeight:
                                                1.4,
                                        }}
                                    >
                                        {
                                            locator.reason
                                        }
                                    </div>
                                )}

                                {/* Test result */}
                                {result && (
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "flex-start",
                                            gap: 6,
                                            marginTop:
                                                8,
                                            padding:
                                                "7px 8px",
                                            borderRadius:
                                                6,
                                            background:
                                                result.found
                                                    ? "rgba(63,185,80,.08)"
                                                    : "rgba(248,81,73,.08)",
                                            color:
                                                result.found
                                                    ? "#3FB950"
                                                    : "#F85149",
                                            fontSize:
                                                10,
                                            lineHeight:
                                                1.4,
                                        }}
                                    >
                                        {result.found ? (
                                            <Check
                                                size={
                                                    13
                                                }
                                                style={{
                                                    flexShrink: 0,
                                                }}
                                            />
                                        ) : (
                                            <X
                                                size={
                                                    13
                                                }
                                                style={{
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}

                                        <span>
                                            {result.found
                                                ? "Element found"
                                                : result.error ||
                                                "Element not found"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                },
            )}
            <AddInputDialog
                open={
                    inputLocator !== null
                }
                locatorStrategy={
                    inputLocator
                        ? formatStrategy(
                            inputLocator.strategy,
                        )
                        : ""
                }
                locator={
                    inputLocator?.value ?? ""
                }
                onCancel={
                    handleCancelInput
                }
                onConfirm={
                    handleConfirmInput
                }
            />
        </div>
    );

}



function getLocatorKey(
    locator: LocatorCandidate,
): string {
    return `${locator.strategy}:${locator.value}`;
}

function toFlowLocatorStrategy(
    strategy: LocatorCandidate["strategy"],
): LocatorStrategy {
    switch (strategy) {
        case "accessibilityId":
            return "accessibilityId";

        case "id":
            return "id";

        case "xpath":
            return "xpath";

        case "className":
            return "className";

        case "androidUiAutomator":
            return "androidUiAutomator";

        case "iosPredicate":
            return "iOSPredicateString";

        case "iosClassChain":
            return "iOSClassChain";

        default:
            throw new Error(
                `Unsupported locator strategy: ${strategy}`,
            );
    }
}



function formatStrategy(
    strategy: LocatorCandidate["strategy"],
): string {
    switch (strategy) {
        case "accessibilityId":
            return "Accessibility ID";

        case "androidUiAutomator":
            return "Android UiAutomator";

        case "iosPredicate":
            return "iOS Predicate";

        case "iosClassChain":
            return "iOS Class Chain";

        case "className":
            return "Class Name";

        case "xpath":
            return "XPath";

        case "id":
            return "Resource ID";

        default:
            return strategy;
    }
}



