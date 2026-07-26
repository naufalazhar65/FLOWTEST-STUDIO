import { useFlowStore } from "../../store/useFlowStore";

export function InspectorPanel() {
    const { nodes, selectedNodeId } = useFlowStore();

    const node = nodes.find(
        (node) => node.id === selectedNodeId
    );

    if (!node) {
        return (
            <div
                style={{
                    padding: 24,
                    color: "#9CA3AF",
                }}
            >
                Select a node
            </div>
        );
    }

    return (
        <div
            style={{
                padding: 24,
                color: "#FFF",
            }}
        >
            <h2>{node.data.title}</h2>

            <p>{node.data.subtitle}</p>
        </div>
    );
}