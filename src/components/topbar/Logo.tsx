export function Logo() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
            }}
        >
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#7C5CFC",
                    display: "grid",
                    placeItems: "center",
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: 18,
                }}
            >
                F
            </div>

            <div>
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#FFF",
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
    );
}