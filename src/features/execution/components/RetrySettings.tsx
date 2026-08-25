import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    RotateCcw,
} from "lucide-react";

import {
    useExecutionRetryStore,
} from "../store/useExecutionRetryStore";

export function RetrySettings() {
    const [
        open,
        setOpen,
    ] = useState(false);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const enabled =
        useExecutionRetryStore(
            (state) =>
                state.enabled,
        );

    const maxAttempts =
        useExecutionRetryStore(
            (state) =>
                state.maxAttempts,
        );

    const retryDelayMs =
        useExecutionRetryStore(
            (state) =>
                state.retryDelayMs,
        );

    const setEnabled =
        useExecutionRetryStore(
            (state) =>
                state.setEnabled,
        );

    const setMaxAttempts =
        useExecutionRetryStore(
            (state) =>
                state.setMaxAttempts,
        );

    const setRetryDelayMs =
        useExecutionRetryStore(
            (state) =>
                state.setRetryDelayMs,
        );

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleMouseDown(
            event: MouseEvent,
        ) {
            const target =
                event.target;

            if (
                !(target instanceof Node)
            ) {
                return;
            }

            if (
                containerRef.current &&
                !containerRef.current.contains(
                    target,
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleMouseDown,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleMouseDown,
            );
        };
    }, [open]);

    return (
        <div
            ref={containerRef}
            style={{
                position:
                    "relative",

                flexShrink:
                    0,
            }}
        >
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (current) =>
                            !current,
                    )
                }
                style={{
                    height:
                        30,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        6,

                    padding:
                        "0 9px",

                    border:
                        enabled
                            ? "1px solid #238636"
                            : "1px solid #30363D",

                    borderRadius:
                        6,

                    background:
                        enabled
                            ? "#172B1C"
                            : "#21262D",

                    color:
                        enabled
                            ? "#3FB950"
                            : "#E6EDF3",

                    fontSize:
                        12,

                    fontWeight:
                        500,

                    cursor:
                        "pointer",

                    whiteSpace:
                        "nowrap",

                    userSelect:
                        "none",

                    appearance:
                        "none",

                    WebkitAppearance:
                        "none",
                }}
                title={
                    enabled
                        ? "Retry enabled"
                        : "Retry disabled"
                }
                aria-haspopup="dialog"
                aria-expanded={
                    open
                }
            >
                <RotateCcw
                    size={14}
                />

                <span>
                    {enabled
                        ? `Retry · ${maxAttempts}`
                        : "Retry"}
                </span>
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Retry Settings"
                    style={{
                        position:
                            "fixed",

                        top:
                            72,

                        right:
                            20,

                        zIndex:
                            100000,

                        width:
                            240,

                        padding:
                            12,

                        boxSizing:
                            "border-box",

                        background:
                            "#161B22",

                        border:
                            "1px solid #30363D",

                        borderRadius:
                            8,

                        boxShadow:
                            "0 12px 32px rgba(0, 0, 0, 0.45)",
                    }}
                >
                    <div
                        style={{
                            display:
                                "flex",

                            flexDirection:
                                "column",

                            gap:
                                12,
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    12,

                                fontWeight:
                                    600,

                                color:
                                    "#E6EDF3",
                            }}
                        >
                            Retry Settings
                        </div>

                        <label
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                gap:
                                    8,

                                fontSize:
                                    12,

                                color:
                                    "#C9D1D9",

                                cursor:
                                    "pointer",
                            }}
                        >
                            <span>
                                Enable retry
                            </span>

                            <input
                                type="checkbox"
                                checked={
                                    enabled
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setEnabled(
                                        event
                                            .target
                                            .checked,
                                    )
                                }
                            />
                        </label>

                        <label
                            style={{
                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap:
                                    5,

                                fontSize:
                                    12,

                                color:
                                    "#8B949E",
                            }}
                        >
                            <span>
                                Max attempts
                            </span>

                            <input
                                type="number"
                                min={2}
                                max={5}
                                step={1}
                                value={
                                    maxAttempts
                                }
                                disabled={
                                    !enabled
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setMaxAttempts(
                                        Number(
                                            event
                                                .target
                                                .value,
                                        ),
                                    )
                                }
                                style={{
                                    height:
                                        30,

                                    padding:
                                        "0 8px",

                                    border:
                                        "1px solid #30363D",

                                    borderRadius:
                                        6,

                                    background:
                                        "#0D1117",

                                    color:
                                        "#E6EDF3",

                                    fontSize:
                                        12,

                                    outline:
                                        "none",

                                    boxSizing:
                                        "border-box",

                                    width:
                                        "100%",
                                }}
                            />
                        </label>

                        <label
                            style={{
                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap:
                                    5,

                                fontSize:
                                    12,

                                color:
                                    "#8B949E",
                            }}
                        >
                            <span>
                                Delay (ms)
                            </span>

                            <input
                                type="number"
                                min={0}
                                max={10000}
                                step={100}
                                value={
                                    retryDelayMs
                                }
                                disabled={
                                    !enabled
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setRetryDelayMs(
                                        Number(
                                            event
                                                .target
                                                .value,
                                        ),
                                    )
                                }
                                style={{
                                    height:
                                        30,

                                    padding:
                                        "0 8px",

                                    border:
                                        "1px solid #30363D",

                                    borderRadius:
                                        6,

                                    background:
                                        "#0D1117",

                                    color:
                                        "#E6EDF3",

                                    fontSize:
                                        12,

                                    outline:
                                        "none",

                                    boxSizing:
                                        "border-box",

                                    width:
                                        "100%",
                                }}
                            />
                        </label>

                        <div
                            style={{
                                fontSize:
                                    11,

                                lineHeight:
                                    1.5,

                                color:
                                    "#6E7681",
                            }}
                        >
                            Only transient
                            failures are
                            eligible for
                            automatic retry.
                            Assertion and
                            invalid locator
                            failures are not
                            retried.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}