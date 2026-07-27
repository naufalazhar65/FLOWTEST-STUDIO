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


    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });


    const strokeMap: Record<NodeExecutionStatus, string> = {
        idle: "#4B5563",
        running: "#F59E0B",
        passed: "#22C55E",
        failed: "#EF4444",
    };


    const stroke = strokeMap[edgeStatus];


    return (
        <>
            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke,
                    strokeWidth:
                        edgeStatus === "running"
                            ? 4
                            : 2,

                    transition:
                        "stroke 0.25s ease, stroke-width 0.25s ease",
                }}
            />


            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform:
                            `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
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