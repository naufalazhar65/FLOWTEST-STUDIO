import {
  Camera,
  Search,
} from "lucide-react";

import { getPlugins } from "../../features/flow/services/pluginRegistry";
import { useFlowStore } from "../../features/flow/store/useFlowStore";

export function Sidebar() {
  const { addNode } = useFlowStore();
  const plugins = getPlugins();

  return (
    <aside
      style={{
        width: "100%",
        background: "#161B22",
        borderRight: "1px solid #30363D",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #30363D",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          Component Library
        </h3>

        <p
          style={{
            marginTop: 6,
            color: "#8B949E",
            fontSize: 13,
          }}
        >
          Click to add a node
        </p>

        <div
          style={{
            marginTop: 16,
            background: "#0D1117",
            border: "1px solid #30363D",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: "10px 12px",
            gap: 8,
          }}
        >
          <Search
            size={16}
            color="#8B949E"
          />

          <input
            placeholder="Search component..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#FFF",
            }}
          />
        </div>
      </div>

      {/* Mobile Actions */}
      <div
        style={{
          padding: 20,
        }}
      >
        <h4
          style={{
            color: "#8B949E",
            marginBottom: 12,
          }}
        >
          Mobile Actions
        </h4>

        {plugins.map((plugin) => {
          const Icon = plugin.icon;

          return (
            <SidebarButton
              key={plugin.type}
              icon={<Icon size={18} />}
              label={plugin.title}
              onClick={() =>
                addNode(plugin.type)
              }
            />
          );
        })}

        <h4
          style={{
            marginTop: 28,
            marginBottom: 12,
            color: "#8B949E",
          }}
        >
          Coming Soon
        </h4>

        



        <SidebarButton
          disabled
          icon={<Camera size={18} />}
          label="Screenshot"
        />
      </div>
    </aside>
  );
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function SidebarButton({
  icon,
  label,
  onClick,
  disabled,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid #30363D",
        background: disabled
          ? "#1A1F27"
          : "#0D1117",
        color: disabled
          ? "#555"
          : "#FFF",
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        transition: ".2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}