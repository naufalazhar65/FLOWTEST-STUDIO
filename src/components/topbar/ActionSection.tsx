import {
    ToolbarGroup,
} from "../ui/ToolbarGroup";

import {
    ProjectMenu,
} from "./ProjectMenu";

import {
    RunButton,
} from "./RunButton";

import {
    useProjectStore,
} from "../../features/project/store/useProjectStore";

import {
    EnvironmentSelector,
} from "../../features/environment/components/EnvironmentSelector";

import {
    DatasetSelector,
} from "../../features/testdata/components/DatasetSelector";

import {
    RetrySettings,
} from "../../features/execution/components/RetrySettings";

export function ActionSection() {
    const name =
        useProjectStore(
            (state) =>
                state.name,
        );

    const modified =
        useProjectStore(
            (state) =>
                state.isModified,
        );

    return (
        <div
            style={{
                display:
                    "grid",

                gridTemplateColumns:
                    "minmax(0, 1fr) auto",

                alignItems:
                    "center",

                columnGap:
                    8,

                width:
                    "100%",

                minWidth:
                    0,

                overflow:
                    "visible",
            }}
        >
            {/* Context controls */}
            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        6,

                    minWidth:
                        0,

                    overflow:
                        "hidden",
                }}
            >
                {/* Project */}
                <div
                    style={{
                        flexShrink:
                            1,

                        minWidth:
                            0,

                        overflow:
                            "hidden",
                    }}
                >
                    <ProjectMenu
                        name={name}
                        modified={
                            modified
                        }
                    />
                </div>

                {/* Divider */}
                <div
                    style={{
                        width:
                            1,

                        height:
                            22,

                        background:
                            "#30363D",

                        flexShrink:
                            0,
                    }}
                />

                {/* Environment */}
                <div
                    style={{
                        flexShrink:
                            0,
                    }}
                >
                    <EnvironmentSelector />
                </div>

                {/* Divider */}
                <div
                    style={{
                        width:
                            1,

                        height:
                            22,

                        background:
                            "#30363D",

                        flexShrink:
                            0,
                    }}
                />

                {/* Dataset */}
                <div
                    style={{
                        flexShrink:
                            1,

                        minWidth:
                            0,

                        overflow:
                            "hidden",
                    }}
                >
                    <DatasetSelector />
                </div>
            </div>

            {/* Execution controls */}
            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        6,

                    flexShrink:
                        0,

                    position:
                        "relative",

                    overflow:
                        "visible",
                }}
            >
                {/* Divider */}
                <div
                    style={{
                        width:
                            1,

                        height:
                            22,

                        background:
                            "#30363D",

                        flexShrink:
                            0,
                    }}
                />

                {/* Retry */}
                <ToolbarGroup>
                    <RetrySettings />
                </ToolbarGroup>

                {/* Divider */}
                <div
                    style={{
                        width:
                            1,

                        height:
                            22,

                        background:
                            "#30363D",

                        flexShrink:
                            0,
                    }}
                />

                {/* Run */}
                <ToolbarGroup>
                    <RunButton />
                </ToolbarGroup>
            </div>
        </div>
    );
}