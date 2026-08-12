import {
    Layers3,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";

import { useSuiteStore } from "../store/useSuiteStore";
import { AddTestCaseDialog } from "./AddTestCaseDialog";
import { CreateSuiteDialog } from "./CreateSuiteDialog";
import { EditSuiteDialog } from "./EditSuiteDialog";
import { TestSuiteCard } from "./TestSuiteCard";
import { TestSuiteDetail } from "./TestSuiteDetail";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../themes";

export function TestSuitesPage() {
    const suites = useSuiteStore(
        (state) => state.suites,
    );

    const selectedSuiteId =
        useSuiteStore(
            (state) => state.selectedSuiteId,
        );

    const selectSuite =
        useSuiteStore(
            (state) => state.selectSuite,
        );

    const removeSuite =
        useSuiteStore(
            (state) => state.removeSuite,
        );

    const removeTestCase =
        useSuiteStore(
            (state) => state.removeTestCase,
        );

    const toggleTestCase =
        useSuiteStore(
            (state) => state.toggleTestCase,
        );

    const [search, setSearch] = useState("");
    const [createSuiteOpen, setCreateSuiteOpen] =
        useState(false);
    const [addTestCaseOpen, setAddTestCaseOpen] =
        useState(false);
    const [editSuiteOpen, setEditSuiteOpen] =
        useState(false);
    const [deleteSuiteOpen, setDeleteSuiteOpen] =
        useState(false);

    const filteredSuites = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return suites;
        }

        return suites.filter(
            (suite) =>
                suite.name
                    .toLowerCase()
                    .includes(query) ||
                suite.description
                    .toLowerCase()
                    .includes(query),
        );
    }, [search, suites]);

    const totalTestCases =
        suites.reduce(
            (total, suite) =>
                total +
                suite.testCases.length,
            0,
        );

    const selectedSuite =
        suites.find(
            (suite) =>
                suite.id ===
                selectedSuiteId,
        ) ?? null;

    const handleDeleteSuite = () => {
        if (!selectedSuite) {
            return;
        }

        removeSuite(
            selectedSuite.id,
        );

        setDeleteSuiteOpen(false);
        setAddTestCaseOpen(false);
    };

    return (
        <div
            style={{
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                background:
                    colors.background,
                color: colors.text,
                overflow: "hidden",
            }}
        >
            <header
                style={{
                    minHeight: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: spacing.lg,
                    padding: "0 20px",
                    borderBottom:
                        `1px solid ${colors.border}`,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                        }}
                    >
                        <Layers3
                            size={18}
                            strokeWidth={1.8}
                            color={colors.accent}
                        />

                        <h1
                            style={{
                                margin: 0,
                                ...typography.subtitle,
                                color: colors.text,
                                fontSize: 15,
                                fontWeight: 650,
                            }}
                        >
                            Test Suites
                        </h1>
                    </div>

                    <div
                        style={{
                            marginTop: 4,
                            color:
                                colors.textSecondary,
                            fontSize: 12,
                        }}
                    >
                        Organize and execute automated test flows
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setCreateSuiteOpen(true)
                    }
                    style={{
                        height: 34,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "0 12px",
                        border:
                            "1px solid transparent",
                        borderRadius:
                            radius.md,
                        background:
                            colors.accent,
                        color: "#FFFFFF",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 650,
                        flexShrink: 0,
                    }}
                >
                    <Plus size={15} />
                    New Suite
                </button>
            </header>

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    display: "grid",
                    gridTemplateColumns:
                        "300px minmax(0, 1fr)",
                    overflow: "hidden",
                }}
            >
                <aside
                    style={{
                        minHeight: 0,
                        display: "flex",
                        flexDirection:
                            "column",
                        borderRight:
                            `1px solid ${colors.border}`,
                        background:
                            colors.panel,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding:
                                "14px 14px 12px",
                            borderBottom:
                                `1px solid ${colors.border}`,
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                marginBottom: 9,
                            }}
                        >
                            <span
                                style={{
                                    ...typography.caption,
                                    color:
                                        colors.text,
                                    fontWeight:
                                        650,
                                }}
                            >
                                Suites
                            </span>

                            <span
                                style={{
                                    ...typography.caption,
                                    color:
                                        colors.textMuted,
                                }}
                            >
                                {suites.length}
                            </span>
                        </div>

                        <div
                            style={{
                                position:
                                    "relative",
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
                                onChange={(
                                    event,
                                ) =>
                                    setSearch(
                                        event.target
                                            .value,
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
                                    outline:
                                        "none",
                                    background:
                                        colors.background,
                                    color:
                                        colors.text,
                                    fontSize: 12,
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY:
                                "auto",
                            padding: 10,
                        }}
                    >
                        {filteredSuites.length >
                        0 ? (
                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap: 7,
                                }}
                            >
                                {filteredSuites.map(
                                    (
                                        suite,
                                    ) => (
                                        <TestSuiteCard
                                            key={
                                                suite.id
                                            }
                                            suite={
                                                suite
                                            }
                                            selected={
                                                suite.id ===
                                                selectedSuiteId
                                            }
                                            onClick={() =>
                                                selectSuite(
                                                    suite.id,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div
                                style={{
                                    height:
                                        "100%",
                                    minHeight:
                                        180,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    padding: 20,
                                    textAlign:
                                        "center",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color:
                                                colors.textSecondary,
                                            fontSize:
                                                12,
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {search
                                            ? "No suites found"
                                            : "No test suites yet"}
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                5,
                                            color:
                                                colors.textMuted,
                                            fontSize:
                                                11,
                                            lineHeight:
                                                1.5,
                                        }}
                                    >
                                        {search
                                            ? "Try a different search."
                                            : "Create a suite to organize your flows."}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            padding:
                                "10px 14px",
                            borderTop:
                                `1px solid ${colors.border}`,
                            color:
                                colors.textMuted,
                            fontSize: 10,
                            flexShrink: 0,
                        }}
                    >
                        <span>
                            {suites.length}{" "}
                            {suites.length ===
                            1
                                ? "suite"
                                : "suites"}
                        </span>

                        <span>
                            {totalTestCases}{" "}
                            {totalTestCases ===
                            1
                                ? "test"
                                : "tests"}
                        </span>
                    </div>
                </aside>

                <main
                    style={{
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                    }}
                >
                    {selectedSuite ? (
                        <TestSuiteDetail
                            suite={
                                selectedSuite
                            }
                            onEdit={() =>
                                setEditSuiteOpen(
                                    true,
                                )
                            }
                            onAddTest={() =>
                                setAddTestCaseOpen(
                                    true,
                                )
                            }
                            onToggleTestCase={(
                                testCaseId,
                            ) =>
                                toggleTestCase(
                                    selectedSuite.id,
                                    testCaseId,
                                )
                            }
                            onRemoveTestCase={(
                                testCaseId,
                            ) =>
                                removeTestCase(
                                    selectedSuite.id,
                                    testCaseId,
                                )
                            }
                            onDelete={() =>
                                setDeleteSuiteOpen(
                                    true,
                                )
                            }
                        />
                    ) : (
                        <div
                            style={{
                                height: "100%",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                padding: 32,
                                textAlign:
                                    "center",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: 360,
                                }}
                            >
                                <Layers3
                                    size={30}
                                    strokeWidth={1.3}
                                    color={
                                        colors.textMuted
                                    }
                                />

                                <div
                                    style={{
                                        marginTop:
                                            14,
                                        color:
                                            colors.text,
                                        fontSize:
                                            14,
                                        fontWeight:
                                            650,
                                    }}
                                >
                                    No suite selected
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            6,
                                        color:
                                            colors.textSecondary,
                                        fontSize:
                                            12,
                                        lineHeight:
                                            1.6,
                                    }}
                                >
                                    Select a test suite from
                                    the list to view its test
                                    cases and execution options.
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <CreateSuiteDialog
                open={createSuiteOpen}
                onClose={() =>
                    setCreateSuiteOpen(
                        false,
                    )
                }
            />

            {selectedSuite && (
                <AddTestCaseDialog
                    open={
                        addTestCaseOpen
                    }
                    suite={
                        selectedSuite
                    }
                    onClose={() =>
                        setAddTestCaseOpen(
                            false,
                        )
                    }
                />
            )}

            {selectedSuite && (
                <EditSuiteDialog
                    suite={selectedSuite}
                    open={editSuiteOpen}
                    onClose={() =>
                        setEditSuiteOpen(false)
                    }
                />
            )}

            {deleteSuiteOpen &&
                selectedSuite && (
                    <div
                        role="presentation"
                        onMouseDown={(
                            event,
                        ) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                setDeleteSuiteOpen(
                                    false,
                                );
                            }
                        }}
                        style={{
                            position:
                                "fixed",
                            inset: 0,
                            zIndex: 1200,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            padding: 20,
                            background:
                                "rgba(0, 0, 0, 0.58)",
                            backdropFilter:
                                "blur(4px)",
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-suite-title"
                            style={{
                                width:
                                    "100%",
                                maxWidth:
                                    400,
                                border:
                                    `1px solid ${colors.border}`,
                                borderRadius:
                                    radius.lg,
                                background:
                                    colors.panel,
                                boxShadow:
                                    "0 24px 70px rgba(0,0,0,.45)",
                                overflow:
                                    "hidden",
                            }}
                        >
                            <div
                                style={{
                                    padding:
                                        "18px 18px 16px",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "flex-start",
                                        gap: 11,
                                    }}
                                >
                                    <div
                                        style={{
                                            width:
                                                32,
                                            height:
                                                32,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            borderRadius:
                                                8,
                                            background:
                                                "rgba(248,81,73,.1)",
                                            color:
                                                "#F85149",
                                            flexShrink:
                                                0,
                                        }}
                                    >
                                        <Trash2
                                            size={
                                                16
                                            }
                                        />
                                    </div>

                                    <div
                                        style={{
                                            minWidth:
                                                0,
                                            flex:
                                                1,
                                        }}
                                    >
                                        <div
                                            id="delete-suite-title"
                                            style={{
                                                color:
                                                    colors.text,
                                                fontSize:
                                                    13,
                                                fontWeight:
                                                    650,
                                            }}
                                        >
                                            Delete Suite
                                        </div>

                                        <div
                                            style={{
                                                marginTop:
                                                    5,
                                                color:
                                                    colors.textSecondary,
                                                fontSize:
                                                    11,
                                                lineHeight:
                                                    1.55,
                                            }}
                                        >
                                            Are you sure you want
                                            to delete{" "}
                                            <strong
                                                style={{
                                                    color:
                                                        colors.text,
                                                    fontWeight:
                                                        650,
                                                }}
                                            >
                                                {
                                                    selectedSuite.name
                                                }
                                            </strong>
                                            ? This will remove the
                                            suite and its test case
                                            configuration.
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteSuiteOpen(
                                                false,
                                            )
                                        }
                                        aria-label="Close"
                                        style={{
                                            width:
                                                28,
                                            height:
                                                28,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            border:
                                                "1px solid transparent",
                                            borderRadius:
                                                6,
                                            background:
                                                "transparent",
                                            color:
                                                colors.textMuted,
                                            cursor:
                                                "pointer",
                                            flexShrink:
                                                0,
                                        }}
                                    >
                                        <X
                                            size={
                                                15
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "flex-end",
                                    gap: 8,
                                    padding:
                                        "12px 18px",
                                    borderTop:
                                        `1px solid ${colors.border}`,
                                    background:
                                        colors.background,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteSuiteOpen(
                                            false,
                                        )
                                    }
                                    style={{
                                        height:
                                            32,
                                        padding:
                                            "0 11px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.md,
                                        background:
                                            colors.panel,
                                        color:
                                            colors.textSecondary,
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            11,
                                        fontWeight:
                                            600,
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDeleteSuite
                                    }
                                    style={{
                                        height:
                                            32,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        gap: 6,
                                        padding:
                                            "0 12px",
                                        border:
                                            "1px solid transparent",
                                        borderRadius:
                                            radius.md,
                                        background:
                                            "#F85149",
                                        color:
                                            "#FFFFFF",
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            11,
                                        fontWeight:
                                            650,
                                    }}
                                >
                                    <Trash2
                                        size={
                                            13
                                        }
                                    />
                                    Delete Suite
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}