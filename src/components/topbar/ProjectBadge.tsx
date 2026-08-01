import { useProjectStore } from "../../features/project/store/useProjectStore";

export function ProjectBadge() {
    const name = useProjectStore(
        (state) => state.name,
    );

    const isModified =
        useProjectStore(
            (state) => state.isModified,
        );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <span
                style={{
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: 15,
                }}
            >
                {name}
            </span>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#8B949E",
                }}
            >
                <div
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: isModified
                            ? "#F59E0B"
                            : "#22C55E",
                    }}
                />

                {isModified
                    ? "Modified"
                    : "Saved"}
            </div>
        </div>
    );
}