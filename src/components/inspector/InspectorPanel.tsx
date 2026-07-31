import { Settings2 } from "lucide-react";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useAppiumConfigStore } from "../../features/execution/store/useAppiumConfigStore";

import { InspectorField } from "../../features/flow/components/inspector/InspectorField";
import { getNodePlugin } from "../../features/flow/services/pluginRegistry";
import { validateNode } from "../../features/flow/validation/validateNode";

import { Badge } from "../ui/Badge";
import { Divider } from "../ui/Divider";

export function InspectorPanel() {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
  } = useFlowStore();

  const platform = useAppiumConfigStore(
    (state) => state.config.platformName
  );

  const node = nodes.find(
    (node) => node.id === selectedNodeId
  );

  if (!node) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 240,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1F2937",
              border: "1px solid #374151",
            }}
          >
            <Settings2
              size={34}
              color="#9CA3AF"
            />
          </div>

          <h3
            style={{
              margin: 0,
              color: "#FFF",
            }}
          >
            No node selected
          </h3>

          <p
            style={{
              marginTop: 10,
              color: "#8B949E",
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            Select a node on the canvas to edit its
            properties.
          </p>
        </div>
      </div>
    );
  }

  const plugin = getNodePlugin(
    node.data.action
  );

  const validation = validateNode(node.data);

  const nodeData =
    node.data as unknown as Record<string, unknown>;

  const visibleFields = plugin.fields.filter(
    (field) => {
      if (!field.visibleWhen) {
        return true;
      }

      if (
        field.visibleWhen.platform &&
        field.visibleWhen.platform !== platform
      ) {
        return false;
      }

      return true;
    }
  );

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: 24,
        color: "#FFF",
        boxSizing: "border-box",
        background: "#0F131A",
      }}
    >
      <Badge color={plugin.color}>
        {plugin.title.toUpperCase()}
      </Badge>

      <h2
        style={{
          marginTop: 14,
          marginBottom: 4,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {plugin.title}
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: 24,
          color: "#8B949E",
          lineHeight: 1.6,
        }}
      >
        {plugin.subtitle}
      </p>

      <Section title="General">
        {visibleFields.map((field) => (
          <InspectorField
            key={field.key}
            field={field}
            value={nodeData[field.key]}
            onChange={(value) =>
              updateNodeData(
                node.id,
                {
                  [field.key]: value,
                } as Partial<typeof node.data>
              )
            }
          />
        ))}
      </Section>

      <Section title="Preview">
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#161B22",
            border: "1px solid #30363D",
          }}
        >
          {plugin.preview?.(node.data)}
        </div>
      </Section>

      <Section title="Validation">
        {validation.valid ? (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "#12341F",
              border: "1px solid #10B981",
              color: "#6EE7B7",
              fontWeight: 600,
            }}
          >
            ✓ Node configuration is valid
          </div>
        ) : (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "#3A1618",
              border: "1px solid #EF4444",
            }}
          >
            <div
              style={{
                marginBottom: 10,
                color: "#FCA5A5",
                fontWeight: 700,
              }}
            >
              Validation Errors
            </div>

            {validation.errors.map(
              (error) => (
                <div
                  key={error}
                  style={{
                    color: "#FCA5A5",
                    fontSize: 13,
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  • {error}
                </div>
              )
            )}
          </div>
        )}
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({
  title,
  children,
}: SectionProps) {
  return (
    <div
      style={{
        marginBottom: 26,
      }}
    >
      <Divider />

      <div
        style={{
          marginTop: 18,
          marginBottom: 18,
          fontSize: 12,
          fontWeight: 700,
          color: "#94A3B8",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}