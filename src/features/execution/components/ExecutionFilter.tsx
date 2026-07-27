import { useExecutionLogStore } from "../store/useExecutionLogStore";

const filters = [
    "all",
    "info",
    "success",
    "error",
] as const;

export function ExecutionFilter() {
    const filter = useExecutionLogStore(
        (state) => state.filter
    );

    const setFilter = useExecutionLogStore(
        (state) => state.setFilter
    );

    return (
        <div
            style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
            }}
        >
            {filters.map((item) => (
                <button
                    key={item}
                    onClick={() => setFilter(item)}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid #30363D",
                        background:
                            filter === item
                                ? "#2563EB"
                                : "#161B22",
                        color: "#FFF",
                        cursor: "pointer",
                        fontSize: 12,
                        transition: "all .2s",
                    }}
                >
                    {item.toUpperCase()}
                </button>
            ))}
        </div>
    );
}