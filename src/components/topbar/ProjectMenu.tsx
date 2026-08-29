import { createPortal } from "react-dom";
import { ChevronDown, FilePlus2, FolderOpen, Save, SaveAll, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useProjectTransitionStore } from "../../features/project/store/useProjectTransitionStore";
import {
    requestProjectTransition,
    cancelProjectTransition,
    discardProjectTransition,
    saveAndContinueProjectTransition,
} from "../../features/project/services/projectTransition";
import { executeCommand } from "../../features/command/services/commandRegistry";
import { ProjectBadge } from "./ProjectBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface Props {
    name: string;
    modified: boolean;
}

interface MenuEntry {
    icon: ReactNode;
    label: string;
    shortcut?: string;
    danger?: boolean;
    onSelect: () => void;
}

const MENU_ITEMS: MenuEntry[] = [
    {
        icon: <FilePlus2 size={16} />,
        label: "New Project",
        shortcut: "⌘N",
        onSelect: () => {
            requestProjectTransition("new");
        },
    },
    {
        icon: <FolderOpen size={16} />,
        label: "Open Project",
        shortcut: "⌘O",
        onSelect: () => {
            requestProjectTransition("open");
        },
    },
    {
        icon: <Save size={16} />,
        label: "Save",
        shortcut: "⌘S",
        onSelect: () => {
            void executeCommand("project.save");
        },
    },
    {
        icon: <SaveAll size={16} />,
        label: "Save As",
        shortcut: "⇧⌘S",
        onSelect: () => {
            void executeCommand("project.saveAs");
        },
    },
    {
        icon: <X size={16} />,
        label: "Close Project",
        shortcut: "⇧⌘W",
        danger: true,
        onSelect: () => {
            requestProjectTransition("close");
        },
    },
];

export function ProjectMenu({ name, modified }: Props) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const pendingAction = useProjectTransitionStore((state) => state.pendingAction);

    const closeAndFocus = useCallback(() => {
        setOpen(false);
        buttonRef.current?.focus();
    }, []);

    const focusItemAt = useCallback((index: number) => {
        const count = MENU_ITEMS.length;
        const clamped = ((index % count) + count) % count;
        itemRefs.current[clamped]?.focus();
    }, []);

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                left: rect.left,
            });
            focusItemAt(0);
        }
    }, [open, focusItemAt]);

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeAndFocus();
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement);

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    focusItemAt(currentIndex < 0 ? 0 : currentIndex + 1);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    focusItemAt(currentIndex < 0 ? MENU_ITEMS.length - 1 : currentIndex - 1);
                    break;
                case "Home":
                    event.preventDefault();
                    focusItemAt(0);
                    break;
                case "End":
                    event.preventDefault();
                    focusItemAt(MENU_ITEMS.length - 1);
                    break;
                case "Escape":
                case "Tab":
                    event.preventDefault();
                    closeAndFocus();
                    break;
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, closeAndFocus, focusItemAt]);

    const handleSelect = (index: number) => {
        MENU_ITEMS[index].onSelect();
        closeAndFocus();
    };

    return (
        <>
            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        borderRadius: 8,
                        background: "transparent",
                        border: "none",
                        padding: "4px 6px",
                        cursor: "pointer",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#21262D";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                    }}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-expanded={open}
                    aria-haspopup="menu"
                >
                    <ProjectBadge name={name} modified={modified} />
                    <ChevronDown
                        size={15}
                        style={{
                            color: "#9CA3AF",
                            transition: "transform 0.2s",
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </button>
            </div>

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            width: 240,
                            padding: 6,
                            background: "#1F2937", // gray-800
                            border: "1px solid #374151", // gray-700
                            borderRadius: 8,
                            boxShadow: "0 12px 24px rgba(0,0,0,0.5)",
                            zIndex: 1000,
                        }}
                    >
                        {MENU_ITEMS.map((entry, index) => {
                            const isDivider = index === 2;

                            return (
                                <div key={entry.label}>
                                    {isDivider && (
                                        <div
                                            style={{
                                                height: 1,
                                                margin: "4px 8px",
                                                background: "#374151",
                                            }}
                                        />
                                    )}

                                    <button
                                        ref={(element) => {
                                            itemRefs.current[index] = element;
                                        }}
                                        type="button"
                                        role="menuitem"
                                        tabIndex={-1}
                                        onClick={() => {
                                            handleSelect(index);
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "8px 10px",
                                            background: "transparent",
                                            border: "none",
                                            borderRadius: 6,
                                            color: entry.danger ? "#F87171" : "#E5E7EB",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            fontSize: 13,
                                            transition: "background 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = entry.danger ? "rgba(239,68,68,0.1)" : "#374151";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = entry.danger ? "rgba(239,68,68,0.1)" : "#374151";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                        className="focus-visible:outline-none"
                                    >
                                        {entry.icon}
                                        <span style={{ flex: 1 }}>{entry.label}</span>
                                        {entry.shortcut && <span style={{ color: "#6B7280", fontSize: 11 }}>{entry.shortcut}</span>}
                                    </button>
                                </div>
                            );
                        })}
                    </div>,
                    document.body
                )}

            <ConfirmDialog
                open={pendingAction !== null}
                title="Unsaved Changes"
                message={
                    <>
                        You have unsaved changes in <strong>{name}</strong>.
                        <br />
                        <br />
                        Do you want to save them before continuing?
                    </>
                }
                cancelLabel="Cancel"
                secondaryLabel="Don't Save"
                confirmLabel="Save"
                onCancel={cancelProjectTransition}
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
