import { useEffect } from "react";

interface Props {
  selectedNodeId: string | null;
  removeNode: (id: string) => void;
  setSelectedNode: (
    id: string | null
  ) => void;
}

export function useDeleteNode({
  selectedNodeId,
  removeNode,
  setSelectedNode,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Delete") return;
      if (!selectedNodeId) return;

      removeNode(selectedNodeId);
      setSelectedNode(null);
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedNodeId,
    removeNode,
    setSelectedNode,
  ]);
}