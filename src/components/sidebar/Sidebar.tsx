import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getPlugins } from "../../features/flow/services/pluginRegistry";
import { useFlowStore } from "../../features/flow/store/useFlowStore";

import { SidebarButton } from "./SidebarButton";
import { SidebarSection } from "./SidebarSection";

import {
    platformMetadata,
    categoryMetadata,
} from "./sidebarMetadata";

import type {
    NodeCategory,
    NodePlatform,
    NodePlugin,
} from "../../features/flow/types/NodePlugin";

export function Sidebar() {
    const { addNode } = useFlowStore();

    /* ------------------------------------------ */
    /* Search                                     */
    /* ------------------------------------------ */

    const [search, setSearch] = useState("");

    /* ------------------------------------------ */
    /* Expand State                               */
    /* ------------------------------------------ */

    const [
        expandedPlatforms,
        setExpandedPlatforms,
    ] = useState<Set<NodePlatform>>(
        () =>
            new Set([
                "cross-platform",
            ]),
    );

    const [
        expandedCategories,
        setExpandedCategories,
    ] = useState<Set<string>>(
        () =>
            new Set([
                "cross-platform:interaction",
            ]),
    );

    function togglePlatform(
        platform: NodePlatform,
    ) {
        setExpandedPlatforms((prev) => {
            const next = new Set(prev);

            if (next.has(platform)) {
                next.delete(platform);
            } else {
                next.add(platform);
            }

            return next;
        });
    }

    function toggleCategory(
        platform: NodePlatform,
        category: NodeCategory,
    ) {
        const key =
            `${platform}:${category}`;

        setExpandedCategories((prev) => {
            const next = new Set(prev);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    }

    /* ------------------------------------------ */
    /* Plugin List                                */
    /* ------------------------------------------ */

    const plugins = useMemo(
        () => getPlugins(),
        [],
    );

    const filteredPlugins =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return plugins;
            }

            return plugins.filter(
                (plugin) =>
                    plugin.title
                        .toLowerCase()
                        .includes(
                            keyword,
                        ),
            );
        }, [plugins, search]);

    /* ------------------------------------------ */
    /* Group Plugins                              */
    /* ------------------------------------------ */

    const grouped = useMemo(() => {
        const map =
            new Map<
                NodePlatform,
                Map<
                    NodeCategory,
                    NodePlugin[]
                >
            >();

        filteredPlugins.forEach(
            (plugin) => {
                plugin.supportedPlatforms.forEach(
                    (platform) => {
                        if (
                            !map.has(
                                platform,
                            )
                        ) {
                            map.set(
                                platform,
                                new Map(),
                            );
                        }

                        const categoryMap =
                            map.get(
                                platform,
                            )!;

                        if (
                            !categoryMap.has(
                                plugin.category,
                            )
                        ) {
                            categoryMap.set(
                                plugin.category,
                                [],
                            );
                        }

                        categoryMap
                            .get(
                                plugin.category,
                            )!
                            .push(plugin);
                    },
                );
            },
        );

        return map;
    }, [filteredPlugins]);

    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    Component Library
                </h3>

                <p style={styles.subtitle}>
                    Click any component to
                    add it to the canvas
                </p>

                <div
                    style={
                        styles.searchContainer
                    }
                >
                    <Search
                        size={16}
                        color="#8B949E"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value,
                            )
                        }
                        placeholder="Search component..."
                        style={
                            styles.searchInput
                        }
                    />
                </div>
            </div>

            <div style={styles.content}>
                {[...grouped.entries()].map(
                    ([platform, categoryMap]) => {
                        const platformInfo =
                            platformMetadata[
                            platform
                            ];

                        const PlatformIcon =
                            platformInfo.icon;

                        const totalPlugins =
                            [...categoryMap.values()].reduce(
                                (
                                    total,
                                    plugins,
                                ) =>
                                    total +
                                    plugins.length,
                                0,
                            );

                        return (
                            <SidebarSection
                                key={platform}
                                title={
                                    platformInfo.title
                                }
                                icon={
                                    <PlatformIcon
                                        size={16}
                                    />
                                }
                                accent={
                                    platformInfo.accent
                                }
                                count={totalPlugins}
                                open={expandedPlatforms.has(
                                    platform,
                                )}
                                onToggle={() =>
                                    togglePlatform(
                                        platform,
                                    )
                                }
                            >
                                {expandedPlatforms.has(
                                    platform,
                                ) &&
                                    [...categoryMap.entries()].map(
                                        ([
                                            category,
                                            items,
                                        ]) => {
                                            const info =
                                                categoryMetadata[
                                                category
                                                ];

                                            const Icon =
                                                info.icon;

                                            const categoryKey =
                                                `${platform}:${category}`;

                                            return (
                                                <SidebarSection
                                                    key={
                                                        categoryKey
                                                    }
                                                    title={
                                                        info.title
                                                    }
                                                    icon={
                                                        <Icon
                                                            size={15}
                                                        />
                                                    }
                                                    accent={
                                                        platformInfo.accent
                                                    }
                                                    count={
                                                        items.length
                                                    }
                                                    open={expandedCategories.has(
                                                        categoryKey,
                                                    )}
                                                    onToggle={() =>
                                                        toggleCategory(
                                                            platform,
                                                            category,
                                                        )
                                                    }
                                                >
                                                    {expandedCategories.has(
                                                        categoryKey,
                                                    ) &&
                                                        items.map(
                                                            (
                                                                plugin,
                                                            ) => {
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
                                                            },
                                                        )}
                                                </SidebarSection>
                                            );
                                        },
                                    )}
                            </SidebarSection>
                        );
                    },
                )}
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

        minHeight: 0,

        display: "flex",

        flexDirection: "column",

        background: "#161B22",

        borderRight: "1px solid #30363D",

        overflow: "hidden",
    },

    header: {
        padding: 20,

        borderBottom:
            "1px solid #30363D",

        flexShrink: 0,
    },

    title: {
        margin: 0,

        color: "#E6EDF3",

        fontSize: 18,

        fontWeight: 700,
    },

    subtitle: {
        marginTop: 6,

        color: "#8B949E",

        fontSize: 13,

        lineHeight: 1.5,
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

        transition:
            "border-color .2s ease",
    },

    searchInput: {
        flex: 1,

        border: "none",

        outline: "none",

        background: "transparent",

        color: "#FFFFFF",

        fontSize: 14,
    },

    content: {
        flex: 1,

        minHeight: 0,

        height: 0,

        overflowY: "auto",

        overflowX: "hidden",

        padding: 20,

        scrollbarWidth: "thin",

        overscrollBehavior: "contain",
    },
};