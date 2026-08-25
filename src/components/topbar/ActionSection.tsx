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
                    "flex",

                alignItems:
                    "center",

                gap:
                    8,

                minWidth:
                    0,
            }}
        >
            {/* Project */}
            <ToolbarGroup>
                <ProjectMenu
                    name={name}
                    modified={modified}
                />
            </ToolbarGroup>

            {/* Divider */}
            <div
                style={{
                    width:
                        1,

                    height:
                        24,

                    background:
                        "#30363D",

                    flexShrink:
                        0,
                }}
            />

            {/* Environment */}
            <ToolbarGroup>
                <EnvironmentSelector />
            </ToolbarGroup>

            {/* Divider */}
            <div
                style={{
                    width:
                        1,

                    height:
                        24,

                    background:
                        "#30363D",

                    flexShrink:
                        0,
                }}
            />

            {/* Dataset */}
            <ToolbarGroup>
                <DatasetSelector />
            </ToolbarGroup>

            {/* Divider */}
            <div
                style={{
                    width:
                        1,

                    height:
                        24,

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
    );
}