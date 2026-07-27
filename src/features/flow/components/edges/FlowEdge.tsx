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
import { useExecutionStore } from "../../../execution/store/useExecutionStore";

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

    const status = useExecutionStore(
        (state) => state.status
    );

    const [open, setOpen] = useState(false);

    const stroke =
        status === "running"
            ? "#FBBF24"
            : status === "passed"
                ? "#10B981"
                : status === "failed"
                    ? "#EF4444"
                    : "#3B82F6";

    return (
        <>
            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke,
                    strokeWidth: 3,
                    transition:
                        "stroke .25s ease, stroke-width .25s ease",
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
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: `2px solid ${stroke}`,
                            background: "#161B22",
                            color: stroke,
                            cursor: "pointer",
                            transition: "all .2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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