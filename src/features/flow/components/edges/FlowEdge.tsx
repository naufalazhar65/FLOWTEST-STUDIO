import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    type EdgeProps,
} from "reactflow";
import { useState } from "react";
import { Plus } from "lucide-react";
import { EdgeInsertMenu } from "./EdgeInsertMenu";

import { useFlowStore } from "../../store/useFlowStore";






export function FlowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: EdgeProps) {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,

        targetX,
        targetY,
        targetPosition,
    });
    const insertNode = useFlowStore(
        (state) => state.insertNode
    );
    const [open, setOpen] = useState(false);

    

    return (
        <>
            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                }}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",

                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,

                        pointerEvents: "all",
                    }}
                >
                    <button
                        onClick={() =>
                            setOpen((prev) => !prev)
                        }
                        style={{
                            width: 28,
                            height: 28,

                            borderRadius: "50%",

                            border: "none",

                            background: "#2563EB",

                            color: "#FFF",

                            cursor: "pointer",
                        }}
                    >
                        <Plus size={16} />
                    </button>

                    {open && (
                        <div
                            style={{
                                position: "absolute",
                                top: 40,
                                left: -75,
                                zIndex: 999,
                            }}
                        >
                            <EdgeInsertMenu
                                onSelect={(type) => {
                                    insertNode(id, type);
                                    setOpen(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}