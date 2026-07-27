import type { NodeField } from "../../types/nodeField";

import { TextField } from "./TextField";
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
          fieldKey={String(field.key)}
          value={String(value ?? "")}
        />
      );

    case "select":
      return (
        <SelectField
          nodeId={nodeId}
          fieldKey={String(field.key)}
          value={String(value ?? "")}
          options={field.options ?? []}
        />
      );

    default:
      return null;
  }
}