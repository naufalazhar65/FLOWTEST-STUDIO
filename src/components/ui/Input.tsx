import type {
  CSSProperties,
  InputHTMLAttributes,
} from "react";

import {
  colors,
  radius,
} from "../../themes";

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  helperText?: string;

  error?: string;

  fullWidth?: boolean;

  containerStyle?: CSSProperties;
}

export function Input({
  label,

  helperText,

  error,

  fullWidth = true,

  containerStyle,

  style,

  ...props
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,

        width: fullWidth
          ? "100%"
          : undefined,

        ...containerStyle,
      }}
    >
      {label && (
        <label
          style={{
            color: colors.text,

            fontSize: 13,

            fontWeight: 600,
          }}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          width: "100%",

          height: 42,

          padding: "0 14px",

          background:
            colors.background,

          border: `1px solid ${error
              ? colors.danger
              : colors.border
            }`,

          borderRadius:
            radius.md,

          color: colors.text,

          fontSize: 14,

          outline: "none",

          transition:
            "all .18s ease",

          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor =
            colors.accent;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor =
            error
              ? colors.danger
              : colors.border;
        }}
      />

      {error ? (
        <span
          style={{
            color:
              colors.danger,

            fontSize: 12,
          }}
        >
          {error}
        </span>
      ) : (
        helperText && (
          <span
            style={{
              color:
                colors.textSecondary,

              fontSize: 12,
            }}
          >
            {helperText}
          </span>
        )
      )}
    </div>
  );
}