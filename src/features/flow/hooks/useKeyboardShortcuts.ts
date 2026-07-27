import { useEffect } from "react";

import { useFlowStore } from "../store/useFlowStore";

export function useHistoryShortcuts() {
  const {
    undo,
    redo,
    copyNode,
    pasteNode,
  } = useFlowStore();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform
        .toLowerCase()
        .includes("mac");

      const modifier = isMac
        ? event.metaKey
        : event.ctrlKey;

      if (!modifier) return;

      const key = event.key.toLowerCase();

      if (key === "c") {
        event.preventDefault();
        copyNode();
        return;
      }

      if (key === "v") {
        event.preventDefault();
        pasteNode();
        return;
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, [undo, redo, copyNode, pasteNode]);
}