export function StatusBar() {
    return (
        <footer
            style={{
                height: 30,
                background: "#161B22",
                borderTop: "1px solid #30363D",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                fontSize: 12,
                color: "#8B949E",
            }}
        >
            <span>FlowTest Studio v0.1</span>

            <span>Ready</span>
        </footer>
    );
}