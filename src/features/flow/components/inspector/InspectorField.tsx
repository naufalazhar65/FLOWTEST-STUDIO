import type { NodeField } from "../../types/nodeField";

import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Label } from "../../../../components/ui/Label";

interface Props {
  field: NodeField;

  value: string;

  onChange(value: string | number): void;
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
      <Label>{field.label}</Label>

      {field.type === "text" && (
        <Input
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          value={value ?? ""}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
        />
      )}

      {field.type === "select" && (
        <Select
          value={value}
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
    </div>
  );
}