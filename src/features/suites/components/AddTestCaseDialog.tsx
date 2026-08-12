import {
    Check,
    FileText,
    Loader2,
    Search,
    X,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { importProject } from "../../flow/services/importService";
import { useRecentProjects } from "../../project/hooks/useRecentProjects";

import {
    useSuiteStore,
} from "../store/useSuiteStore";
import type {
    SuiteTestCase,
    TestSuite,
} from "../types/TestSuite";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    open: boolean;
    suite: TestSuite;
    onClose(): void;
}

export function AddTestCaseDialog({
    open,
    suite,
    onClose,
}: Props) {
    const recentProjects =
        useRecentProjects();

    const addTestCase =
        useSuiteStore(
            (state) => state.addTestCase,
        );

    const [search, setSearch] =
        useState("");

    const [selectedProjectId, setSelectedProjectId] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        setSearch("");
        setSelectedProjectId(null);
        setLoading(false);
        setError("");
    }, [open, suite.id]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [open, loading, onClose]);

    const existingProjectIds =
        useMemo(
            () =>
                new Set(
                    suite.testCases.map(
                        (test) =>
                            test.projectId,
                    ),
                ),
            [suite.testCases],
        );

    const filteredProjects =
        useMemo(() => {
            const query =
                search.trim().toLowerCase();

            if (!query) {
                return recentProjects;
            }

            return recentProjects.filter(
                (project) =>
                    project.name
                        .toLowerCase()
                        .includes(query) ||
                    project.fileName
                        .toLowerCase()
                        .includes(query),
            );
        }, [recentProjects, search]);

    const selectedProject =
        recentProjects.find(
            (project) =>
                project.id ===
                selectedProjectId,
        ) ?? null;

    const handleAdd = async () => {
        if (!selectedProject) {
            setError(
                "Select a project first.",
            );
            return;
        }

        if (
            existingProjectIds.has(
                selectedProject.id,
            )
        ) {
            setError(
                "This project is already in the suite.",
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const handle =
                selectedProject.handle;

            const permission =
                await handle.queryPermission({
                    mode: "read",
                });

            if (permission !== "granted") {
                const requested =
                    await handle.requestPermission({
                        mode: "read",
                    });

                if (
                    requested !== "granted"
                ) {
                    setError(
                        "Read permission was not granted for this project.",
                    );
                    return;
                }
            }

            const file =
                await handle.getFile();

            const project =
                await importProject(file);

            if (!project) {
                setError(
                    "Failed to load the selected project.",
                );
                return;
            }

            const testCase: SuiteTestCase = {
                id: crypto.randomUUID(),
                projectId: project.id,
                projectName: project.name,
                enabled: true,
                project,
            };

            addTestCase(
                suite.id,
                testCase,
            );

            onClose();
        } catch (cause) {
            console.error(
                "Failed to add test case:",
                cause,
            );

            setError(
                "Failed to load the selected project. Make sure the project file is still accessible.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                background:
                    "rgba(0, 0, 0, 0.58)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-test-case-title"
                style={{
                    width: "100%",
                    maxWidth: 520,
                    maxHeight:
                        "min(680px, calc(100vh - 40px))",
                    display: "flex",
                    flexDirection: "column",
                    border:
                        `1px solid ${colors.border}`,
                    borderRadius: radius.lg,
                    background: colors.panel,
                    boxShadow:
                        "0 24px 70px rgba(0,0,0,.45)",
                    overflow: "hidden",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "15px 16px",
                        borderBottom:
                            `1px solid ${colors.border}`,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            minWidth: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 7,
                                background:
                                    colors.panelHover,
                                color: colors.accent,
                                flexShrink: 0,
                            }}
                        >
                            <FileText size={15} />
                        </div>

                        <div
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <div
                                id="add-test-case-title"
                                style={{
                                    color: colors.text,
                                    fontSize: 13,
                                    fontWeight: 650,
                                }}
                            >
                                Add Test Case
                            </div>

                            <div
                                style={{
                                    marginTop: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color:
                                        colors.textMuted,
                                    fontSize: 10,
                                }}
                            >
                                Add a flow project to{" "}
                                {suite.name}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border:
                                "1px solid transparent",
                            borderRadius: 6,
                            background:
                                "transparent",
                            color:
                                colors.textMuted,
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading
                                ? 0.5
                                : 1,
                            flexShrink: 0,
                        }}
                    >
                        <X size={16} />
                    </button>
                </header>

                <div
                    style={{
                        padding: 16,
                        borderBottom:
                            `1px solid ${colors.border}`,
                        flexShrink: 0,
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
                            autoFocus
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target.value,
                                );
                                setError("");
                            }}
                            placeholder="Search recent projects..."
                            aria-label="Search recent projects"
                            style={{
                                width: "100%",
                                height: 34,
                                boxSizing:
                                    "border-box",
                                padding:
                                    "0 10px 0 30px",
                                border:
                                    `1px solid ${colors.border}`,
                                borderRadius:
                                    radius.md,
                                outline: "none",
                                background:
                                    colors.background,
                                color: colors.text,
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
                    {filteredProjects.length >
                        0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: 6,
                            }}
                        >
                            {filteredProjects.map(
                                (project) => {
                                    const alreadyAdded =
                                        existingProjectIds.has(
                                            project.id,
                                        );

                                    const selected =
                                        project.id ===
                                        selectedProjectId;

                                    return (
                                        <button
                                            key={project.id}
                                            type="button"
                                            disabled={
                                                alreadyAdded ||
                                                loading
                                            }
                                            onClick={() => {
                                                if (
                                                    alreadyAdded
                                                ) {
                                                    return;
                                                }

                                                setSelectedProjectId(
                                                    project.id,
                                                );
                                                setError(
                                                    "",
                                                );
                                            }}
                                            style={{
                                                width: "100%",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 10,
                                                padding:
                                                    "10px 11px",
                                                border:
                                                    `1px solid ${selected
                                                        ? colors.accent
                                                        : colors.border
                                                    }`,
                                                borderRadius:
                                                    radius.md,
                                                background:
                                                    selected
                                                        ? colors.panelHover
                                                        : "transparent",
                                                color:
                                                    colors.text,
                                                cursor:
                                                    alreadyAdded ||
                                                        loading
                                                        ? "not-allowed"
                                                        : "pointer",
                                                opacity:
                                                    alreadyAdded
                                                        ? 0.45
                                                        : 1,
                                                textAlign:
                                                    "left",
                                                transition:
                                                    "background .15s ease, border-color .15s ease",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    borderRadius:
                                                        7,
                                                    background:
                                                        selected
                                                            ? colors.accent
                                                            : colors.background,
                                                    color:
                                                        selected
                                                            ? "#FFFFFF"
                                                            : colors.textSecondary,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {selected ? (
                                                    <Check
                                                        size={14}
                                                    />
                                                ) : (
                                                    <FileText
                                                        size={14}
                                                    />
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    minWidth: 0,
                                                    flex: 1,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        color:
                                                            colors.text,
                                                        fontSize: 12,
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    {
                                                        project.name
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: 3,
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        color:
                                                            colors.textMuted,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {
                                                        project.fileName
                                                    }
                                                </div>
                                            </div>

                                            {alreadyAdded && (
                                                <span
                                                    style={{
                                                        flexShrink: 0,
                                                        color:
                                                            colors.textMuted,
                                                        fontSize: 10,
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    Added
                                                </span>
                                            )}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                minHeight: 220,
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                padding: 24,
                                textAlign:
                                    "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    borderRadius: 10,
                                    background:
                                        colors.panelHover,
                                    color:
                                        colors.textMuted,
                                }}
                            >
                                <FileText
                                    size={18}
                                />
                            </div>

                            <div
                                style={{
                                    marginTop: 12,
                                    color:
                                        colors.text,
                                    fontSize: 13,
                                    fontWeight:
                                        650,
                                }}
                            >
                                {recentProjects.length >
                                    0
                                    ? "No projects found"
                                    : "No recent projects"}
                            </div>

                            <div
                                style={{
                                    maxWidth: 340,
                                    marginTop: 5,
                                    color:
                                        colors.textMuted,
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                }}
                            >
                                {recentProjects.length >
                                    0
                                    ? "Try a different search."
                                    : "Open a .flow project first, then it will appear here."}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div
                        style={{
                            margin: "0 16px 12px",
                            padding: "8px 10px",
                            border:
                                "1px solid rgba(248,81,73,.25)",
                            borderRadius: radius.md,
                            background:
                                "rgba(248,81,73,.08)",
                            color: "#F85149",
                            fontSize: 11,
                            lineHeight: 1.4,
                            flexShrink: 0,
                        }}
                    >
                        {error}
                    </div>
                )}

                <footer
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "flex-end",
                        gap: 8,
                        padding: "12px 16px",
                        borderTop:
                            `1px solid ${colors.border}`,
                        background:
                            colors.background,
                        flexShrink: 0,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            height: 32,
                            padding: "0 11px",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.md,
                            background:
                                colors.panel,
                            color:
                                colors.textSecondary,
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading
                                ? 0.5
                                : 1,
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            void handleAdd();
                        }}
                        disabled={
                            !selectedProject ||
                            loading
                        }
                        style={{
                            height: 32,
                            minWidth: 112,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            gap: 6,
                            padding: "0 12px",
                            border:
                                "1px solid transparent",
                            borderRadius:
                                radius.md,
                            background:
                                selectedProject &&
                                    !loading
                                    ? colors.accent
                                    : colors.panelHover,
                            color:
                                selectedProject &&
                                    !loading
                                    ? "#FFFFFF"
                                    : colors.textMuted,
                            cursor:
                                selectedProject &&
                                    !loading
                                    ? "pointer"
                                    : "not-allowed",
                            fontSize: 11,
                            fontWeight: 650,
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    size={13}
                                    style={{
                                        animation:
                                            "spin 1s linear infinite",
                                    }}
                                />
                                Loading...
                            </>
                        ) : (
                            "Add Test Case"
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
}