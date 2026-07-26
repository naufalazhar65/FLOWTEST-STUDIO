import { nodeRegistry } from "../../config/nodeRegistry";
import type { NodeType } from "../../config/nodeRegistry";

interface Props {
  onSelect(type: NodeType): void;
}

export function EdgeInsertMenu({
  onSelect,
}: Props) {
  return (
    <div
      style={{
        background: "#202632",
        border: "1px solid #313847",
        borderRadius: 12,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 180,
        boxShadow:
          "0 8px 20px rgba(0,0,0,.35)",
      }}
    >
      {(
        Object.entries(nodeRegistry) as [
          NodeType,
          (typeof nodeRegistry)[NodeType]
        ][]
      ).map(([type, config]) => {
        const Icon = config.icon;

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",

              background: "transparent",

              border: "none",

              color: "#FFF",

              borderRadius: 8,

              cursor: "pointer",

              textAlign: "left",
            }}
          >
            <Icon
              size={18}
              color={config.color}
            />

            {config.title}
          </button>
        );
      })}
    </div>
  );
}