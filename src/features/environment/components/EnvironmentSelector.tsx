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
                        6,
                }}
            >
                <span
                    style={{
                        fontSize:
                            12,

                        color:
                            "#8B949E",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    Environment
                </span>

                <select
                    value={
                        activeEnvironment
                    }
                    onChange={
                        handleChange
                    }
                    style={{
                        width:
                            110,

                        height:
                            30,

                        padding:
                            "0 8px",

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
                            "#161B22",

                        color:
                            "#8B949E",

                        cursor:
                            "pointer",
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