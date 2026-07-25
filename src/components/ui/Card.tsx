import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, ...props }: Props) {
  return (
    <div
      {...props}
      style={{
        background: "#161B22",
        border: "1px solid #30363D",
        borderRadius: 12,
        padding: 16,
        ...props.style,
      }}
    >
      {children}
    </div>
  );
}