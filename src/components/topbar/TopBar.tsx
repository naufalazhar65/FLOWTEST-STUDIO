import { Play, Smartphone, Cpu, Download } from "lucide-react";
import { Button } from "../ui/Button";

export function TopBar() {
  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#161B22",
        borderBottom: "1px solid #30363D",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#7C5CFC",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          F
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            FlowTest Studio
          </div>

          <div
            style={{
              color: "#8B949E",
              fontSize: 12,
            }}
          >
            Mobile Automation Flow Builder
          </div>
        </div>
      </div>

      {/* Center */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#0D1117",
            border: "1px solid #30363D",
            padding: "8px 14px",
            borderRadius: 10,
          }}
        >
          <Smartphone size={16} />
          Android
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#0D1117",
            border: "1px solid #30363D",
            padding: "8px 14px",
            borderRadius: 10,
            color: "#3FB950",
          }}
        >
          <Cpu size={16} />
          Appium Connected
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <Button>
          <Play size={16} />
          Run
        </Button>

        <Button>
          <Download size={16} />
          Export
        </Button>
      </div>
    </header>
  );
}