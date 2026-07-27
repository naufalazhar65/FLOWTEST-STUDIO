import type {
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

export function Label({
  children,
}: Props) {
  return (
    <div
      style={{
        marginBottom: 6,
        color: "#8B949E",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}