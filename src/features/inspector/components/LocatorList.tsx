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

import {
    colors,
    radius,
    spacing,
} from "../../../themes";

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
                    color:
                        colors.textSecondary,
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
                                    `1px solid ${colors.border}`,
                                borderRadius:
                                    radius.sm,
                                overflow:
                                    "hidden",
                                background:
                                    colors.panel,
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
                                        `${spacing.sm}px ${spacing.sm + 2}px`,
                                    borderBottom:
                                        `1px solid ${colors.border}`,
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
                                            color={
                                                colors
                                                    .warning
                                            }
                                            style={{
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}

                                    <span
                                        style={{
                                            color:
                                                colors
                                                    .text,
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
                                                    radius
                                                        .xs,
                                                background:
                                                    `${colors.warning}1F`,
                                                color:
                                                    colors
                                                        .warning,
                                                fontSize:
                                                    9,
                                                fontWeight:
                                                    700,
                                                letterSpacing:
                                                    "0.05em",
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
                                    <LocatorActionButton
                                        title="Test locator"
                                        disabled={
                                            testing !==
                                            null
                                        }
                                        opacity={
                                            testing !==
                                                null &&
                                                !isTesting
                                                ? 0.5
                                                : 1
                                        }
                                        color={
                                            isTesting
                                                ? colors
                                                      .accentHover
                                                : ""
                                        }
                                        onClick={() =>
                                            void handleTestLocator(
                                                locator,
                                            )
                                        }
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
                                    </LocatorActionButton>

                                    <LocatorActionButton
                                        title="Copy locator"
                                        onClick={() =>
                                            void copyLocator(
                                                locator,
                                            )
                                        }
                                    >
                                        {copied ===
                                            locator.strategy ? (
                                            <Check
                                                size={
                                                    14
                                                }
                                                color={
                                                    colors
                                                        .success
                                                }
                                            />
                                        ) : (
                                            <Copy
                                                size={
                                                    14
                                                }
                                            />
                                        )}
                                    </LocatorActionButton>

                                    <LocatorActionButton
                                        title="Add Tap node"
                                        onClick={() =>
                                            handleAddTap(
                                                locator,
                                            )
                                        }
                                    >
                                        <Plus
                                            size={14}
                                        />
                                    </LocatorActionButton>

                                    <LocatorActionButton
                                        title="Add Input node"
                                        onClick={() =>
                                            handleAddInput(locator)
                                        }
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                            }}
                                        >
                                            IN
                                        </span>
                                    </LocatorActionButton>
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
                                            `${spacing.sm}px ${spacing.sm + 2}px`,
                                        borderRadius:
                                            radius.xs,
                                        background:
                                            colors
                                                .background,
                                        color:
                                            colors
                                                .text,
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
                                                colors
                                                    .textMuted,
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
                                                radius.xs,
                                            background:
                                                result.found
                                                    ? `${colors.success}14`
                                                    : `${colors.danger}14`,
                                            color:
                                                result.found
                                                    ? colors
                                                          .success
                                                    : colors
                                                          .danger,
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



interface LocatorActionButtonProps {
    title: string;

    children: React.ReactNode;

    onClick(): void;

    disabled?: boolean;

    opacity?: number;

    color?: string;
}

function LocatorActionButton({
    title,
    children,
    onClick,
    disabled = false,
    opacity = 1,
    color = colors.textSecondary,
}: LocatorActionButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            title={title}
            style={{
                display: "grid",
                placeItems: "center",
                width: 28,
                height: 28,
                padding: 0,
                border: "none",
                borderRadius:
                    radius.xs,
                background:
                    "transparent",
                color,
                cursor: disabled
                    ? "default"
                    : "pointer",
                opacity,
                transition:
                    "all .15s",
            }}
        >
            {children}
        </button>
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



