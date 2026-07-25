import {
  MousePointerClick,
  Keyboard,
  BadgeCheck,
  Hand,
  Undo2,
  Redo2,
  ScanSearch,
} from "lucide-react";

const actions = [
  {
    label: "Tap",
    icon: MousePointerClick,
  },
  {
    label: "Input",
    icon: Keyboard,
  },
  {
    label: "Assert",
    icon: BadgeCheck,
  },
  {
    label: "Swipe",
    icon: Hand,
  },
];

export function Toolbar() {
  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px",
        borderBottom: "1px solid #232935",
        background: "#151922",
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#202632",
              border: "1px solid #313847",
              color: "white",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            <Icon size={18} />

            {action.label}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      <button style={iconButton}>
        <Undo2 size={18} />
      </button>

      <button style={iconButton}>
        <Redo2 size={18} />
      </button>

      <button style={iconButton}>
        <ScanSearch size={18} />
      </button>
    </div>
  );
}

const iconButton = {
  width: 38,
  height: 38,
  borderRadius: 8,
  border: "1px solid #313847",
  background: "#202632",
  color: "white",
  cursor: "pointer",
};