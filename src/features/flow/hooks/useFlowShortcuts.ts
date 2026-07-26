import { useEffect } from "react";

import { useFlowStore } from "../store/useFlowStore";

export function useFlowShortcuts() {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const ctrl =
        event.ctrlKey || event.metaKey;

      if (!ctrl) return;

      const {
        undo,
        redo,
      } = useFlowStore.getState();

      switch (event.key.toLowerCase()) {
        case "z":
          event.preventDefault();

          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;

        case "y":
          event.preventDefault();
          redo();
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);
}