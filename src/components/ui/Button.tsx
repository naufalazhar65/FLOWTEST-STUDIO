import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        border: 0,
        cursor: "pointer",
        padding: "10px 18px",
        borderRadius: 10,
        background: "#7C5CFC",
        color: "white",
        fontWeight: 600,
        transition: ".2s",
      }}
    >
      {children}
    </button>
  );
}