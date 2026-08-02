import type { FlowNode } from "../../flow/types/flowNode";

import { GeneratorToolbar } from "./GeneratorToolbar";
import { CodePreview } from "./CodePreview";

interface GeneratorPanelProps {
    nodes: FlowNode[];
}

export function GeneratorPanel({
    nodes,
}: GeneratorPanelProps) {
    return (
        <div className="flex h-full flex-col border-l">
            <GeneratorToolbar
                nodes={nodes}
            />

            <div className="flex-1 overflow-hidden">
                <CodePreview />
            </div>
        </div>
    );
}