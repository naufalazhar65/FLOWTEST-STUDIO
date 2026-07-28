import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Camera,
  Search,
} from "lucide-react";

import { getPlugins } from "../../features/flow/services/pluginRegistry";
import { useFlowStore } from "../../features/flow/store/useFlowStore";

export function Sidebar() {
  const { addNode } = useFlowStore();

  const [search, setSearch] = useState("");

  const plugins = useMemo(
    () => getPlugins(),
    []
  );

  const filteredPlugins = useMemo(() => {
    return plugins.filter((plugin) =>
      plugin.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [plugins, search]);

  const sections = [
    {
      title: "Interaction",
      actions: ["tap", "input", "swipe", "scroll"],
    },
    {
      title: "Synchronization",
      actions: ["delay", "wait"],
    },
    {
      title: "Validation",
      actions: ["assert"],
    },
    {
      title: "Variables",
      actions: ["setVariable"],
    },
    {
      title: "Device",
      actions: [
        "launchApp",
        "closeApp",
        "back",
        "home",
        "screenshot",
      ]
    },
    {
      title: "Logic",

      actions: [
        "if",
      ],
    },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Component Library
        </h3>

        <p style={styles.subtitle}>
          Click any component to add it to the canvas
        </p>

        <div style={styles.searchContainer}>
          <Search
            size={16}
            color="#8B949E"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search component..."
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.content}>
        {sections.map((section) => {
          const items = filteredPlugins.filter(
            (plugin) =>
              section.actions.includes(plugin.type)
          );

          if (items.length === 0) return null;

          return (
            <div
              key={section.title}
              style={{ marginBottom: 26 }}
            >
              <SectionTitle>
                {section.title}
              </SectionTitle>

              {items.map((plugin) => {
                const Icon = plugin.icon;

                return (
                  <SidebarButton
                    key={plugin.type}
                    icon={
                      <Icon size={18} />
                    }
                    label={plugin.title}
                    onClick={() =>
                      addNode(plugin.type)
                    }
                  />
                );
              })}
            </div>
          );
        })}

        <div style={{ marginTop: 24 }}>
          <SectionTitle>Coming Soon</SectionTitle>

          <SidebarButton
            disabled
            icon={<Camera size={18} />}
            label=""
          />
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 12,
      }}
    >
      <div
        style={{
          color: "#8B949E",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {children}
      </div>

      <div
        style={{
          height: 1,
          background: "#2A313C",
        }}
      />
    </div>
  );
}

interface SidebarButtonProps {
  icon: ReactNode;
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
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        marginBottom: 10,
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
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;

        e.currentTarget.style.background =
          "#1C212B";

        e.currentTarget.style.borderColor =
          "#3B82F6";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;

        e.currentTarget.style.background =
          "#0D1117";

        e.currentTarget.style.borderColor =
          "#30363D";
      }}
    >
      {icon}

      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#161B22",
    borderRight: "1px solid #30363D",
    overflow: "hidden",
  },

  header: {
    padding: 20,
    borderBottom: "1px solid #30363D",
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 6,
    color: "#8B949E",
    fontSize: 13,
  },

  searchContainer: {
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #30363D",
    background: "#0D1117",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#FFF",
    fontSize: 14,
  },

  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: 20,
  },
};