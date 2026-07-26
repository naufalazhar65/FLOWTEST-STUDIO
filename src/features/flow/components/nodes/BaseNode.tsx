import type { ReactNode } from "react";
import { Handle, Position } from "reactflow";

interface BaseNodeProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
  children?: ReactNode;
}

export function BaseNode({
  title,
  subtitle,
  icon,
  color,
  children,
}: BaseNodeProps) {
  return (
    <div
      style={{
        width: 240,
        background: "#1A1F29",
        border: `2px solid ${color}`,
        borderRadius: 14,
        overflow: "hidden",
        color: "#FFF",
        boxShadow: "0 8px 30px rgba(0,0,0,.30)",
      }}
    >
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 12,
          height: 12,
          background: color,
          border: "2px solid white",
        }}
      />

      {/* Header */}
      <div
        style={{
          background: color,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {icon}
        {title}
      </div>

      {/* Body */}
      <div
        style={{
          padding: 16,
          color: "#AAB2BF",
          fontSize: 13,
          lineHeight: 1.6,
          minHeight: 80,
        }}
      >
        {children ?? subtitle}
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 12,
          height: 12,
          background: color,
          border: "2px solid white",
        }}
      />
    </div>
  );
}