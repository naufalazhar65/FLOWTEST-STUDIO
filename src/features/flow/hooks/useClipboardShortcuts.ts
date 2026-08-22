import { useEffect } from "react";

import { useFlowStore } from "../store/useFlowStore";

export function useClipboardShortcuts() {
  const {
    copyNode,
    pasteNode,
  } = useFlowStore();

  useEffect(() => {
    const handler = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target;

      if (
        target instanceof
        HTMLInputElement ||
        target instanceof
        HTMLTextAreaElement ||
        target instanceof
        HTMLSelectElement ||
        (
          target instanceof
          HTMLElement &&
          target.isContentEditable
        )
      ) {
        return;
      }

      const isMac =
        navigator.platform
          .toLowerCase()
          .includes("mac");

      const modifier =
        isMac
          ? event.metaKey
          : event.ctrlKey;

      if (!modifier) {
        return;
      }

      const key =
        event.key.toLowerCase();

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
      handler,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler,
      );
  }, [
    copyNode,
    pasteNode,
  ]);
}