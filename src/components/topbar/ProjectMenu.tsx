import {
    ChevronDown,
    FilePlus2,
    FolderOpen,
    Save,
    SaveAll,
    X,
} from "lucide-react";

import { useState } from "react";

import type { ReactNode } from "react";

import {
    colors,
    radius,
    shadow,
} from "../../themes";

import {
    useWorkspaceStore,
} from "../../features/workspace/store/useWorkspaceStore";

import {
    useProjectStore,
} from "../../features/project/store/useProjectStore";

import {
    executeCommand,
} from "../../features/command/services/commandRegistry";

import { ProjectBadge } from "./ProjectBadge";

import { ConfirmDialog } from "../ui/ConfirmDialog";

interface Props {
    name: string;
    modified: boolean;
}

type ProjectTransition =
    | "new"
    | "open"
    | "close";

export function ProjectMenu({
    name,
    modified,
}: Props) {
    const [open, setOpen] =
        useState(false);

    const [
        confirmTransition,
        setConfirmTransition,
    ] = useState<ProjectTransition | null>(
        null,
    );

    const openCreateProject =
        useWorkspaceStore(
            (state) =>
                state.openCreateProject,
        );

    const projectModified =
        useProjectStore(
            (state) =>
                state.isModified,
        );

    /**
     * Execute the actual project action.
     */
    async function executeTransition(
        action: ProjectTransition,
    ) {
        switch (action) {
            case "new":
                openCreateProject();
                break;

            case "open":
                await executeCommand(
                    "project.open",
                );
                break;

            case "close":
                await executeCommand(
                    "project.close",
                );
                break;
        }
    }

    /**
     * Ask for confirmation when the
     * current project has unsaved changes.
     */
    function requestTransition(
        action: ProjectTransition,
    ) {
        setOpen(false);

        const hasUnsavedChanges =
            projectModified || modified;

        if (hasUnsavedChanges) {
            setConfirmTransition(action);
            return;
        }

        void executeTransition(action);
    }

    /**
     * Cancel the pending transition.
     */
    function handleCancelTransition() {
        setConfirmTransition(null);
    }

    /**
     * Save the current project first,
     * then continue with the requested action.
     */
    async function handleSaveAndContinue() {
        const action =
            confirmTransition;

        if (!action) {
            return;
        }

        try {
            await executeCommand(
                "project.save",
            );

            const stillModified =
                useProjectStore
                    .getState()
                    .isModified;

            /*
             * Save was cancelled or failed.
             * Keep the confirmation dialog open.
             */
            if (stillModified) {
                return;
            }

            setConfirmTransition(null);

            await executeTransition(
                action,
            );
        } catch (error) {
            console.error(
                "Failed to save project:",
                error,
            );
        }
    }

    /**
     * Discard current changes and
     * continue with the requested action.
     */
    async function handleDiscardAndContinue() {
        const action =
            confirmTransition;

        if (!action) {
            return;
        }

        try {
            setConfirmTransition(null);

            await executeTransition(
                action,
            );
        } catch (error) {
            console.error(
                "Failed to continue project transition:",
                error,
            );
        }
    }

    return (
        <>
            <div
                style={{
                    position: "relative",
                }}
            >
                <button
                    type="button"
                    onClick={() =>
                        setOpen(
                            (value) =>
                                !value,
                        )
                    }
                    style={{
                        display: "flex",
                        alignItems:
                            "center",

                        gap: 6,

                        background:
                            "transparent",

                        border: "none",

                        padding: 0,

                        cursor: "pointer",
                    }}
                >
                    <ProjectBadge
                        name={name}
                        modified={
                            modified
                        }
                    />

                    <ChevronDown
                        size={15}
                        color={
                            colors.textSecondary
                        }
                        style={{
                            transition:
                                "transform .18s ease",

                            transform:
                                open
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                        }}
                    />
                </button>

                {open && (
                    <div
                        style={{
                            position:
                                "absolute",

                            top:
                                "calc(100% + 8px)",

                            left: 0,

                            width: 240,

                            padding: 6,

                            background:
                                colors.panel,

                            border:
                                `1px solid ${colors.border}`,

                            borderRadius:
                                radius.md,

                            boxShadow:
                                shadow.floating,

                            zIndex: 1000,
                        }}
                    >
                        <MenuItem
                            icon={
                                <FilePlus2
                                    size={16}
                                />
                            }
                            label="New Project"
                            shortcut="⌘N"
                            onClick={() =>
                                requestTransition(
                                    "new",
                                )
                            }
                        />

                        <MenuItem
                            icon={
                                <FolderOpen
                                    size={16}
                                />
                            }
                            label="Open Project"
                            shortcut="⌘O"
                            onClick={() =>
                                requestTransition(
                                    "open",
                                )
                            }
                        />

                        <MenuDivider />

                        <MenuItem
                            icon={
                                <Save
                                    size={16}
                                />
                            }
                            label="Save"
                            shortcut="⌘S"
                            onClick={() => {
                                setOpen(
                                    false,
                                );

                                void executeCommand(
                                    "project.save",
                                );
                            }}
                        />

                        <MenuItem
                            icon={
                                <SaveAll
                                    size={16}
                                />
                            }
                            label="Save As"
                            shortcut="⇧⌘S"
                            onClick={() => {
                                setOpen(
                                    false,
                                );

                                void executeCommand(
                                    "project.saveAs",
                                );
                            }}
                        />

                        <MenuDivider />

                        <MenuItem
                            icon={
                                <X size={16} />
                            }
                            label="Close Project"
                            shortcut="⇧⌘W"
                            danger
                            onClick={() =>
                                requestTransition(
                                    "close",
                                )
                            }
                        />
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={
                    confirmTransition !==
                    null
                }
                title="Unsaved Changes"
                message={
                    <>
                        You have unsaved
                        changes in{" "}
                        <strong>
                            {name}
                        </strong>
                        .
                        <br />
                        <br />
                        Do you want to save
                        them before
                        continuing?
                    </>
                }
                cancelLabel="Cancel"
                secondaryLabel="Don't Save"
                confirmLabel="Save"
                onCancel={
                    handleCancelTransition
                }
                onSecondary={() => {
                    void handleDiscardAndContinue();
                }}
                onConfirm={() => {
                    void handleSaveAndContinue();
                }}
            />
        </>
    );
}

interface MenuItemProps {
    icon: ReactNode;

    label: string;

    shortcut?: string;

    danger?: boolean;

    onClick: () => void;
}

function MenuItem({
    icon,
    label,
    shortcut,
    danger = false,
    onClick,
}: MenuItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                width: "100%",

                display: "flex",

                alignItems:
                    "center",

                gap: 10,

                padding: "9px 10px",

                background:
                    "transparent",

                border: "none",

                borderRadius:
                    radius.sm,

                color: danger
                    ? colors.danger
                    : colors.text,

                cursor: "pointer",

                textAlign: "left",

                fontSize: 13,
            }}
            onMouseEnter={(
                event,
            ) => {
                event.currentTarget.style.background =
                    colors.panelHover;
            }}
            onMouseLeave={(
                event,
            ) => {
                event.currentTarget.style.background =
                    "transparent";
            }}
        >
            {icon}

            <span
                style={{
                    flex: 1,
                }}
            >
                {label}
            </span>

            {shortcut && (
                <span
                    style={{
                        color:
                            colors.textMuted,

                        fontSize: 11,
                    }}
                >
                    {shortcut}
                </span>
            )}
        </button>
    );
}

function MenuDivider() {
    return (
        <div
            style={{
                height: 1,

                margin: "6px 4px",

                background:
                    colors.border,
            }}
        />
    );
}