import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getPlugins } from "../../features/flow/services/pluginRegistry";
import { useFlowStore } from "../../features/flow/store/useFlowStore";

import { SidebarButton } from "./SidebarButton";
import { SidebarSection } from "./SidebarSection";
import { sidebarSections } from "./sidebarSections";

export function Sidebar() {
    const { addNode } = useFlowStore();

    const [search, setSearch] = useState("");

    const [openSections, setOpenSections] = useState(() =>
        Object.fromEntries(
            sidebarSections.map((section) => [
                section.id,
                section.defaultOpen,
            ]),
        ),
    );

    const plugins = useMemo(
        () => getPlugins(),
        [],
    );

    const filteredPlugins = useMemo(() => {
        return plugins.filter((plugin) =>
            plugin.title
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [plugins, search]);

    function toggleSection(id: string) {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const searching = search.trim().length > 0;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    Component Library
                </h3>

                <p style={styles.subtitle}>
                    Click any component to add it to the canvas
                </p>

                <div style={styles.searchContainer}>
                    <Search
                        size={16}
                        color="#8B949E"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search component..."
                        style={styles.searchInput}
                    />
                </div>
            </div>

            <div style={styles.content}>
                {sidebarSections.map((section) => {
                    const items =
                        filteredPlugins.filter((plugin) =>
                            section.actions.includes(
                                plugin.type,
                            ),
                        );

                    if (items.length === 0) {
                        return null;
                    }

                    const Icon = section.icon;

                    return (
                        <SidebarSection
                            accent={section.accent}

                            key={section.id}
                            title={section.title}
                            icon={
                                <Icon size={16} />
                            }
                            count={items.length}
                            open={
                                searching
                                    ? true
                                    : openSections[
                                    section.id
                                    ]
                            }
                            onToggle={() =>
                                toggleSection(
                                    section.id,
                                )
                            }
                        >
                            {items.map((plugin) => {
                                const PluginIcon =
                                    plugin.icon;

                                return (
                                    <SidebarButton
                                        key={
                                            plugin.type
                                        }
                                        icon={
                                            <PluginIcon
                                                size={
                                                    18
                                                }
                                            />
                                        }
                                        label={
                                            plugin.title
                                        }
                                        onClick={() =>
                                            addNode(
                                                plugin.type,
                                            )
                                        }
                                    />
                                );
                            })}
                        </SidebarSection>
                    );
                })}
            </div>
        </aside>
    );
}

const styles: Record<
    string,
    React.CSSProperties
> = {
    sidebar: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#161B22",
        borderRight:
            "1px solid #30363D",
        overflow: "hidden",
    },

    header: {
        padding: 20,
        borderBottom:
            "1px solid #30363D",
    },

    title: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
    },

    subtitle: {
        marginTop: 6,
        color: "#8B949E",
        fontSize: 13,
    },

    searchContainer: {
        marginTop: 18,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        border:
            "1px solid #30363D",
        background: "#0D1117",
    },

    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#FFF",
        fontSize: 14,
    },

    content: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: 20,
    },
};