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
            onWheel={(event) => {
                event.stopPropagation();
            }}
            onWheelCapture={(event) => {
                event.stopPropagation();
            }}
            style={{
                width: 180,
                height: 420,
                maxHeight:
                    "calc(100vh - 32px)",

                boxSizing: "border-box",

                display: "flex",
                flexDirection: "column",
                gap: 6,

                padding: 8,

                overflowY: "auto",
                overflowX: "hidden",

                overscrollBehavior:
                    "contain",

                background: "#202632",

                border:
                    "1px solid #313847",

                borderRadius: 12,

                boxShadow:
                    "0 8px 20px rgba(0,0,0,.35)",

                scrollbarWidth: "thin",

                scrollbarColor:
                    "#4B5563 transparent",
            }}
        >
            {plugins.map((plugin) => {
                const Icon = plugin.icon;

                return (
                    <button
                        key={plugin.type}
                        type="button"
                        onClick={() =>
                            onSelect(
                                plugin.type,
                            )
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",

                            width: "100%",

                            flexShrink: 0,

                            gap: 10,

                            padding:
                                "10px 12px",

                            background:
                                "transparent",

                            border: "none",

                            color: "#FFF",

                            borderRadius: 8,

                            cursor: "pointer",

                            textAlign: "left",
                        }}
                    >
                        <Icon
                            size={18}
                            color={
                                plugin.color
                            }
                        />

                        <span>
                            {plugin.title}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}