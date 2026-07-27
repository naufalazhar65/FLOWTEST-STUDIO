import type {
  InputHTMLAttributes,
} from "react";

type Props =
  InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        background: "#0D1117",
        border: "1px solid #30363D",
        borderRadius: 8,
        color: "#FFF",
        fontSize: 14,
        outline: "none",
        ...props.style,
      }}
    />
  );
}