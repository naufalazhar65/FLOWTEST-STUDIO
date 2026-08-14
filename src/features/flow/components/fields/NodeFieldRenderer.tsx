import type { NodeField } from "../../types/nodeField";

import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";

interface Props {
  nodeId: string;

  field: NodeField;

  value: unknown;
}

export function NodeFieldRenderer({
  nodeId,
  field,
  value,
}: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextField
          nodeId={nodeId}
          fieldKey={String(
            field.key,
          )}
          value={String(
            value ?? "",
          )}
        />
      );

    case "number":
      return (
        <NumberField
          nodeId={nodeId}
          fieldKey={String(
            field.key,
          )}
          value={
            typeof value ===
              "number"
              ? value
              : Number(
                value ??
                0,
              )
          }
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );

    case "select":
      return (
        <SelectField
          nodeId={nodeId}
          fieldKey={String(
            field.key,
          )}
          value={String(
            value ?? "",
          )}
          options={
            field.options ??
            []
          }
        />
      );

    default:
      return null;
  }
}