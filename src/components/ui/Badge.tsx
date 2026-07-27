import type {
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;

  color?: string;
}

export function Badge({
  children,
  color = "#7C5CFC",
}: Props) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        background: color,
        color: "#FFF",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}