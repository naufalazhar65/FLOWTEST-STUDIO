import type {
  SelectHTMLAttributes,
} from "react";

type Props =
  SelectHTMLAttributes<HTMLSelectElement>;

export function Select(props: Props) {
  return (
    <select
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