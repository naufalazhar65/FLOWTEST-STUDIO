import { useEffect } from "react";

import { useCommandStore } from "../store/useCommandStore";

export function useCommandHotkey() {
    const open =
        useCommandStore(
            (s) => s.openPalette,
        );

    const close =
        useCommandStore(
            (s) => s.closePalette,
        );

    const isOpen =
        useCommandStore(
            (s) => s.open,
        );

    useEffect(() => {
        function onKeyDown(
            e: KeyboardEvent,
        ) {
            if (
                !(e.metaKey || e.ctrlKey) ||
                e.key.toLowerCase() !==
                    "k"
            ) {
                return;
            }

            e.preventDefault();

            if (isOpen) {
                close();
            } else {
                open();
            }
        }

        window.addEventListener(
            "keydown",
            onKeyDown,
        );

        return () =>
            window.removeEventListener(
                "keydown",
                onKeyDown,
            );
    }, [
        open,
        close,
        isOpen,
    ]);
}