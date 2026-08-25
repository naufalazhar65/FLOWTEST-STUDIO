import {
    useState,
} from "react";

import type {
    ChangeEvent,
} from "react";

import {
    Settings2,
} from "lucide-react";

import {
    useEnvironmentStore,
} from "../store/useEnvironmentStore";

import type {
    EnvironmentName,
} from "../types/EnvironmentProfile";

import {
    EnvironmentConfiguration,
} from "./EnvironmentConfiguration";

export function EnvironmentSelector() {
    const [
        configurationOpen,
        setConfigurationOpen,
    ] = useState(false);

    const activeEnvironment =
        useEnvironmentStore(
            (state) =>
                state.activeEnvironment,
        );

    const environments =
        useEnvironmentStore(
            (state) =>
                state.environments,
        );

    const setActiveEnvironment =
        useEnvironmentStore(
            (state) =>
                state.setActiveEnvironment,
        );

    function handleChange(
        event: ChangeEvent<HTMLSelectElement>,
    ) {
        setActiveEnvironment(
            event.target
                .value as EnvironmentName,
        );
    }

    return (
        <>
            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        5,
                }}
            >
                <select
                    value={
                        activeEnvironment
                    }
                    onChange={
                        handleChange
                    }
                    title={`Environment: ${activeEnvironment}`}
                    style={{
                        height:
                            30,

                        minWidth:
                            96,

                        padding:
                            "0 26px 0 9px",

                        border:
                            "1px solid #30363D",

                        borderRadius:
                            6,

                        background:
                            "#161B22",

                        color:
                            "#E6EDF3",

                        fontSize:
                            12,

                        outline:
                            "none",

                        cursor:
                            "pointer",
                    }}
                >
                    {environments.map(
                        (
                            environment,
                        ) => (
                            <option
                                key={
                                    environment.name
                                }
                                value={
                                    environment.name
                                }
                            >
                                {
                                    environment.name
                                }
                            </option>
                        ),
                    )}
                </select>

                <button
                    type="button"
                    onClick={() =>
                        setConfigurationOpen(
                            true,
                        )
                    }
                    title="Configure environment"
                    aria-label="Configure environment"
                    style={{
                        width:
                            30,

                        height:
                            30,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            0,

                        border:
                            "1px solid #30363D",

                        borderRadius:
                            6,

                        background:
                            "#21262D",

                        color:
                            "#8B949E",

                        cursor:
                            "pointer",

                        flexShrink:
                            0,
                    }}
                >
                    <Settings2
                        size={15}
                    />
                </button>
            </div>

            <EnvironmentConfiguration
                open={
                    configurationOpen
                }
                onClose={() =>
                    setConfigurationOpen(
                        false,
                    )
                }
            />
        </>
    );
}