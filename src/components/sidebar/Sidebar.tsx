import {
    useMemo,
    useState,
} from "react";

import type {
    CSSProperties,
} from "react";

import { Search } from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

import {
    getPlugins,
} from "../../features/flow/services/pluginRegistry";

import {
    useFlowStore,
} from "../../features/flow/store/useFlowStore";

import {
    SidebarButton,
} from "./SidebarButton";

import {
    SidebarSection,
} from "./SidebarSection";

import {
    SidebarCategory,
} from "./SidebarCategory";

import {
    WorkspaceNavigation,
} from "./WorkspaceNavigation";

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
    const { addNode } =
        useFlowStore();

    /* ------------------------------------------ */
    /* Search                                     */
    /* ------------------------------------------ */

    const [search, setSearch] =
        useState("");

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
                "android",
                "ios",
            ]),
    );

    function togglePlatform(
        platform: NodePlatform,
    ) {
        setExpandedPlatforms(
            (prev) => {
                const next =
                    new Set(prev);

                if (
                    next.has(platform)
                ) {
                    next.delete(
                        platform,
                    );
                } else {
                    next.add(
                        platform,
                    );
                }

                return next;
            },
        );
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
                            .push(
                                plugin,
                            );
                    },
                );
            },
        );

        return map;
    }, [filteredPlugins]);

    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: spacing.xs,
                    }}
                >
                    <h3
                        style={
                            styles.title
                        }
                    >
                        Component Library
                    </h3>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Click any component
                        to add it to the
                        canvas
                    </p>
                </div>

                <div
                    style={
                        styles.searchContainer
                    }
                >
                    <Search
                        size={16}
                        color={
                            colors.textSecondary
                        }
                        strokeWidth={2}
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value,
                            )
                        }
                        placeholder="Search component..."
                        aria-label="Search components"
                        style={
                            styles.searchInput
                        }
                    />
                </div>
            </div>

            <WorkspaceNavigation />

            <div
                style={
                    styles.content
                }
            >
                {[...grouped.entries()].map(
                    ([
                        platform,
                        categoryMap,
                    ]) => {
                        const platformInfo =
                            platformMetadata[
                                platform
                            ];

                        const PlatformIcon =
                            platformInfo.icon;

                        const totalPlugins =
                            [
                                ...categoryMap.values(),
                            ].reduce(
                                (
                                    total,
                                    pluginItems,
                                ) =>
                                    total +
                                    pluginItems.length,
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
                                count={
                                    totalPlugins
                                }
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
                                    [
                                        ...categoryMap.entries(),
                                    ].map(
                                        ([
                                            category,
                                            items,
                                        ]) => {
                                            const info =
                                                categoryMetadata[
                                                    category
                                                ];

                                            return (
                                                <div
                                                    key={`${platform}-${category}`}
                                                    style={{
                                                        marginBottom:
                                                            spacing.sm,
                                                    }}
                                                >
                                                    <SidebarCategory
                                                        title={
                                                            info.title
                                                        }
                                                        count={
                                                            items.length
                                                        }
                                                        accent={
                                                            platformInfo.accent
                                                        }
                                                    />

                                                    {items.map(
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
                                                                    subtitle={
                                                                        plugin.subtitle
                                                                    }
                                                                    color={
                                                                        plugin.color
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
                                                </div>
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
    CSSProperties
> = {
    sidebar: {
        width: "100%",

        height: "100%",

        minHeight: 0,

        display: "flex",

        flexDirection: "column",

        background:
            colors.panel,

        borderRight:
            `1px solid ${colors.border}`,

        overflow: "hidden",

        boxSizing: "border-box",
    },

    header: {
        padding:
            `${spacing.lg}px ${spacing.md}px`,

        borderBottom:
            `1px solid ${colors.border}`,

        flexShrink: 0,

        background:
            colors.panel,
    },

    title: {
        margin: 0,

        color:
            colors.text,

        fontSize:
            typography.title
                .fontSize,

        fontWeight:
            typography.title
                .fontWeight,

        lineHeight: 1.3,

        letterSpacing:
            "-0.01em",
    },

    subtitle: {
        margin: 0,

        color:
            colors.textSecondary,

        fontSize:
            typography.caption
                .fontSize,

        fontWeight:
            typography.body
                .fontWeight,

        lineHeight: 1.4,
    },

    searchContainer: {
        marginTop:
            spacing.md,

        display: "flex",

        alignItems: "center",

        gap: spacing.sm,

        height: 38,

        padding:
            `0 ${spacing.md}px`,

        boxSizing:
            "border-box",

        borderRadius:
            radius.md,

        border:
            `1px solid ${colors.border}`,

        background:
            colors.background,

        transition:
            "border-color 150ms ease, box-shadow 150ms ease",
    },

    searchInput: {
        flex: 1,

        minWidth: 0,

        height: "100%",

        border: "none",

        outline: "none",

        padding: 0,

        background:
            "transparent",

        color:
            colors.text,

        fontSize:
            typography.body
                .fontSize,

        fontWeight:
            typography.body
                .fontWeight,
    },

    content: {
        flex: 1,

        minHeight: 0,

        height: 0,

        overflowY: "auto",

        overflowX: "hidden",

        padding:
            `${spacing.sm}px ${spacing.md}px ${spacing.lg}px`,

        scrollbarWidth:
            "thin",

        scrollbarColor:
            `${colors.borderLight} transparent`,

        overscrollBehavior:
            "contain",
    },
};