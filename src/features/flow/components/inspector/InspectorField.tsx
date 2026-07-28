import type { NodeField } from "../../types/nodeField";

import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Label } from "../../../../components/ui/Label";

interface Props {
  field: NodeField;

  value: unknown;

  onChange(
    value: string | number | boolean
  ): void;
}

export function InspectorField({
  field,
  value,
  onChange,
}: Props) {
  return (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      {field.type !== "checkbox" && (
        <Label>{field.label}</Label>
      )}

      {field.type === "text" && (
        <Input
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          value={
            typeof value === "number"
              ? value
              : ""
          }
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(
              Number(e.target.value)
            )
          }
        />
      )}

      {field.type === "select" && (
        <Select
          value={String(value ?? "")}
          onChange={(e) =>
            onChange(e.target.value)
          }
        >
          {field.options?.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </Select>
      )}

      {field.type === "textarea" && (
        <textarea
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: 100,
            resize: "vertical",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #30363D",
            background: "#161B22",
            color: "#FFF",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      )}

      {field.type === "checkbox" && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            color: "#FFF",
            fontSize: 14,
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) =>
              onChange(e.target.checked)
            }
          />

          {field.label}
        </label>
      )}
    </div>
  );
}