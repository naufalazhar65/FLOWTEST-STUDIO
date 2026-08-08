export function FooterSection() {
    return (
        <div
            style={{
                position: "absolute",

                bottom: 24,

                display: "flex",
                alignItems: "center",

                gap: 10,

                color: "#6E7681",

                fontSize: 11,

                letterSpacing:
                    "0.02em",
            }}
        >
            <span>
                FlowTest Studio
            </span>

            <span
                style={{
                    width: 3,
                    height: 3,

                    borderRadius: "50%",

                    background:
                        "#484F58",
                }}
            />

            <span>
                v0.2 Alpha
            </span>

            <span
                style={{
                    width: 3,
                    height: 3,

                    borderRadius: "50%",

                    background:
                        "#484F58",
                }}
            />

            <span
                style={{
                    color: "#8B949E",
                }}
            >
                Ready
            </span>
        </div>
    );
}