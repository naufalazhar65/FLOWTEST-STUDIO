import type { CSSProperties } from "react";

import type { NodeField } from "../../types/nodeField";

interface InspectorFieldProps {
  field: NodeField;

  value: string;

  onChange: (value: string) => void;
}

export function InspectorField({
  field,
  value,
  onChange,
}: InspectorFieldProps) {
  return (
    <div
      style={{
        marginBottom: 22,
      }}
    >
      <div
        style={{
          marginBottom: 8,
          color: "#8B949E",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {field.label}
      </div>

      {field.type === "text" ? (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          style={inputStyle}
        />
      ) : (
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          style={inputStyle}
        >
          {(field.options ?? []).map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #30363D",
  background: "#0D1117",
  color: "#FFF",
  outline: "none",
  fontSize: 14,
};