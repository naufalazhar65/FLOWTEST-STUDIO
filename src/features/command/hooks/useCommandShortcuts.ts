import { useEffect } from "react";

import {
    executeCommand,
} from "../services/commandRegistry";

function isEditableElement(
    target: EventTarget | null,
): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
    );
}

export function useCommandShortcuts() {
    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            const modifier =
                event.metaKey ||
                event.ctrlKey;

            if (!modifier) {
                return;
            }

            const key =
                event.key.toLowerCase();

            const editable =
                isEditableElement(
                    event.target,
                );

            let commandId:
                | string
                | null = null;

            // ---------------------------------------
            // Project
            // ---------------------------------------

            if (key === "n") {
                commandId =
                    "project.new";
            }

            if (key === "o") {
                commandId =
                    "project.open";
            }

            if (
                key === "s" &&
                event.shiftKey
            ) {
                commandId =
                    "project.saveAs";
            } else if (
                key === "s"
            ) {
                commandId =
                    "project.save";
            }

            if (
                key === "w" &&
                event.shiftKey
            ) {
                commandId =
                    "project.close";
            }

            // ---------------------------------------
            // Execution
            // ---------------------------------------

            if (key === "r") {
                commandId =
                    "flow.run";
            }

            // ---------------------------------------
            // Flow Editing
            // ---------------------------------------

            if (
                key === "c" &&
                !editable
            ) {
                commandId =
                    "node.copy";
            }

            if (
                key === "v" &&
                !editable
            ) {
                commandId =
                    "node.paste";
            }

            if (
                key === "z" &&
                event.shiftKey
            ) {
                commandId =
                    "edit.redo";
            } else if (
                key === "z"
            ) {
                commandId =
                    "edit.undo";
            }

            if (!commandId) {
                return;
            }

            event.preventDefault();

            void executeCommand(
                commandId,
            ).catch((error) => {
                console.error(
                    `Command failed: ${commandId}`,
                    error,
                );
            });
        }

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
    }, []);
}