import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    type EdgeProps,
} from "reactflow";

import { memo, useState } from "react";
import { Plus } from "lucide-react";

import { EdgeInsertMenu } from "./EdgeInsertMenu";

import { useFlowStore } from "../../store/useFlowStore";
import { useExecutionStore } from "../../../execution/store/useExecutionStore";

import type { NodeExecutionStatus } from "../../../execution/types/NodeExecutionStatus";

function edgeColor(
    status: NodeExecutionStatus
) {
    switch (status) {
        case "running":
            return "#F59E0B";

        case "passed":
            return "#22C55E";

        case "failed":
            return "#EF4444";

        default:
            return "#4B5563";
    }
}

export const FlowEdge = memo(function FlowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: EdgeProps) {
    const [open, setOpen] = useState(false);

    const insertNode = useFlowStore(
        (state) => state.insertNode
    );

    const edgeStatus = useExecutionStore(
        (state) => state.edgeStatus[id] ?? "idle"
    );

    const [path, labelX, labelY] =
        getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });

    const stroke = edgeColor(edgeStatus);

    return (
        <>
            <style>
                {`
          @keyframes edge-flow {
            from {
              stroke-dashoffset: 14;
            }

            to {
              stroke-dashoffset: 0;
            }
          }
        `}
            </style>

            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke,

                    strokeWidth:
                        edgeStatus === "running"
                            ? 4
                            : 2,

                    strokeDasharray:
                        edgeStatus === "running"
                            ? "8 6"
                            : undefined,

                    animation:
                        edgeStatus === "running"
                            ? "edge-flow .8s linear infinite"
                            : undefined,

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
                        type="button"
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition:
                                "transform .2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                                "scale(1.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                                "scale(1)";
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
});