import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
  };

export function Button({
  children,
  disabled,
  style,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        border: 0,
        padding: "10px 18px",
        borderRadius: 10,

        background: disabled
          ? "#30363D"
          : "#7C5CFC",

        color: disabled
          ? "#8B949E"
          : "#FFFFFF",

        fontWeight: 600,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled ? 0.6 : 1,

        transition: ".2s",

        ...style,
      }}
    >
      {children}
    </button>
  );
}