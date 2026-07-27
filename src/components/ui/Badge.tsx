import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;

  color: string;
}

export function Badge({
  children,
  color,
}: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        minWidth: 70,

        padding: "3px 10px",

        borderRadius: 999,

        background: color,

        color: "#FFF",

        fontSize: 11,

        fontWeight: 700,

        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}