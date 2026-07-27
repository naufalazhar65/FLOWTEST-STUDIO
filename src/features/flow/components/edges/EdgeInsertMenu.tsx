import { getPlugins } from "../../services/pluginRegistry";
import type { NodeType } from "../../types/NodePlugin";

interface Props {
  onSelect: (type: NodeType) => void;
}

export function EdgeInsertMenu({
  onSelect,
}: Props) {
  const plugins = getPlugins();

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
      {plugins.map((plugin) => {
        const Icon = plugin.icon;

        return (
          <button
            key={plugin.type}
            onClick={() => onSelect(plugin.type)}
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
              color={plugin.color}
            />
            {plugin.title}
          </button>
        );
      })}
    </div>
  );
}