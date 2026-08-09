import { useInspectorStore } from "../store/useInspectorStore";

export function ElementProperties() {
    const element =
        useInspectorStore(
            (state) =>
                state.selectedElement,
        );

    if (!element) {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    color: "#8B949E",
                    fontSize: 13,
                    textAlign: "center",
                }}
            >
                Select an element to inspect
                its properties.
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100%",
                overflowY: "auto",
                padding: 16,
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div
                style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom:
                        "1px solid #30363D",
                }}
            >
                <div
                    style={{
                        color: "#A78BFA",
                        fontFamily:
                            "monospace",
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    {element.tagName}
                </div>

                {getElementName(element) && (
                    <div
                        style={{
                            marginTop: 6,
                            color: "#F0F6FC",
                            fontSize: 15,
                            fontWeight: 600,
                            wordBreak:
                                "break-word",
                        }}
                    >
                        {getElementName(
                            element,
                        )}
                    </div>
                )}
            </div>

            <PropertySection title="Identity">
                <PropertyRow
                    label="Text"
                    value={element.text}
                />

                <PropertyRow
                    label="Label"
                    value={element.label}
                />

                <PropertyRow
                    label="Name"
                    value={element.name}
                />

                <PropertyRow
                    label="Value"
                    value={element.value}
                />
            </PropertySection>

            <PropertySection title="Accessibility">
                <PropertyRow
                    label="Accessibility ID"
                    value={
                        element.contentDescription
                    }
                />

                <PropertyRow
                    label="Accessible"
                    value={
                        element.accessible
                    }
                />
            </PropertySection>

            <PropertySection title="Attributes">
                <PropertyRow
                    label="Resource ID"
                    value={
                        element.resourceId
                    }
                />

                <PropertyRow
                    label="Class"
                    value={
                        element.className
                    }
                />

                <PropertyRow
                    label="Bounds"
                    value={
                        element.bounds
                    }
                />
            </PropertySection>

            <PropertySection title="State">
                <PropertyRow
                    label="Displayed"
                    value={
                        element.displayed
                    }
                />

                <PropertyRow
                    label="Enabled"
                    value={
                        element.enabled
                    }
                />

                <PropertyRow
                    label="Selected"
                    value={
                        element.selected
                    }
                />
            </PropertySection>
        </div>
    );
}

interface PropertySectionProps {
    title: string;
    children: React.ReactNode;
}

function PropertySection({
    title,
    children,
}: PropertySectionProps) {
    return (
        <section
            style={{
                marginBottom: 20,
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color: "#8B949E",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform:
                        "uppercase",
                    letterSpacing: 0.6,
                }}
            >
                {title}
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    border:
                        "1px solid #30363D",
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            >
                {children}
            </div>
        </section>
    );
}

interface PropertyRowProps {
    label: string;
    value:
        | string
        | boolean
        | undefined;
}

function PropertyRow({
    label,
    value,
}: PropertyRowProps) {
    if (
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "110px minmax(0, 1fr)",
                gap: 12,
                padding:
                    "8px 10px",
                background:
                    "rgba(255,255,255,0.015)",
                fontSize: 12,
            }}
        >
            <span
                style={{
                    color: "#8B949E",
                }}
            >
                {label}
            </span>

            <span
                style={{
                    minWidth: 0,
                    color: "#F0F6FC",
                    fontFamily:
                        "monospace",
                    whiteSpace:
                        "pre-wrap",
                    overflowWrap:
                        "anywhere",
                }}
            >
                {String(value)}
            </span>
        </div>
    );
}

function getElementName(
    element: {
        label?: string;
        name?: string;
        text?: string;
        contentDescription?: string;
        value?: string;
        resourceId?: string;
    },
): string {
    return (
        element.label ||
        element.name ||
        element.text ||
        element.contentDescription ||
        element.value ||
        element.resourceId ||
        ""
    );
}