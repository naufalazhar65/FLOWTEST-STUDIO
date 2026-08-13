import {
    ChevronDown,
    FilePlus2,
    FolderOpen,
    Save,
    SaveAll,
    X,
} from "lucide-react";

import {
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import {
    colors,
    radius,
    shadow,
} from "../../themes";

import {
    useProjectTransitionStore,
} from "../../features/project/store/useProjectTransitionStore";

import {
    requestProjectTransition,
    cancelProjectTransition,
    discardProjectTransition,
    saveAndContinueProjectTransition,
} from "../../features/project/services/projectTransition";

import {
    executeCommand,
} from "../../features/command/services/commandRegistry";

import {
    ProjectBadge,
} from "./ProjectBadge";

import {
    ConfirmDialog,
} from "../ui/ConfirmDialog";

interface Props {
    name: string;
    modified: boolean;
}

export function ProjectMenu({
    name,
    modified: _modified,
}: Props) {
    const [open, setOpen] =
        useState(false);

    const pendingAction =
        useProjectTransitionStore(
            (state) =>
                state.pendingAction,
        );

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
                        alignItems: "center",
                        gap: 6,
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                    }}
                >
                    <ProjectBadge
                        name={name}
                        modified={_modified}
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
                            onClick={() => {
                                setOpen(false);

                                requestProjectTransition(
                                    "new",
                                );
                            }}
                        />

                        <MenuItem
                            icon={
                                <FolderOpen
                                    size={16}
                                />
                            }
                            label="Open Project"
                            shortcut="⌘O"
                            onClick={() => {
                                setOpen(false);

                                requestProjectTransition(
                                    "open",
                                );
                            }}
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
                                setOpen(false);

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
                                setOpen(false);

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
                            onClick={() => {
                                setOpen(false);

                                requestProjectTransition(
                                    "close",
                                );
                            }}
                        />
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={
                    pendingAction !== null
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
                    cancelProjectTransition
                }
                onSecondary={() => {
                    void discardProjectTransition();
                }}
                onConfirm={() => {
                    void saveAndContinueProjectTransition();
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
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                background: "transparent",
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