import {
    useEffect,
    useState,
} from "react";

import {
    Button,
} from "../../../components/ui/Button";

import {
    Input,
} from "../../../components/ui/Input";

import {
    Label,
} from "../../../components/ui/Label";

import {
    Select,
} from "../../../components/ui/Select";

import {
    Modal,
} from "../../../components/ui/Modal";

import {
    DialogBody,
} from "../../../components/ui/DialogBody";

import {
    DialogFooter,
} from "../../../components/ui/DialogFooter";

import {
    DialogHeader,
} from "../../../components/ui/DialogHeader";

import {
    useEnvironmentStore,
} from "../store/useEnvironmentStore";

import type {
    EnvironmentName,
    EnvironmentProfile,
} from "../types/EnvironmentProfile";

interface EnvironmentConfigurationProps {
    open: boolean;

    onClose(): void;
}

interface VariableEntry {
    key: string;

    value: string;

    secret: boolean;
}

const environmentNames:
    EnvironmentName[] = [
        "local",
        "development",
        "staging",
        "production",
    ];

export function EnvironmentConfiguration({
    open,
    onClose,
}: EnvironmentConfigurationProps) {
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

    const updateEnvironment =
        useEnvironmentStore(
            (state) =>
                state.updateEnvironment,
        );

    const profile =
        environments.find(
            (environment) =>
                environment.name ===
                activeEnvironment,
        );

    const [
        variables,
        setVariables,
    ] = useState<
        VariableEntry[]
    >([]);

    const [
        platformName,
        setPlatformName,
    ] = useState<
        "Android" | "iOS"
    >("Android");

    const [
        deviceName,
        setDeviceName,
    ] = useState("");

    const [
        platformVersion,
        setPlatformVersion,
    ] = useState("");

    const [
        udid,
        setUdid,
    ] = useState("");

    useEffect(() => {
        if (!profile) {
            return;
        }

        setVariables(
            Object.entries(
                profile.variables,
            ).map(
                ([
                    key,
                    variable,
                ]) => ({
                    key,

                    value:
                        variable.secret
                            ? ""
                            : typeof variable.value ===
                                "string"
                                ? variable.value
                                : JSON.stringify(
                                    variable.value,
                                ),

                    secret:
                        variable.secret,
                }),
            ),
        );

        if (
            !profile.deviceProfile
        ) {
            setPlatformName(
                "Android",
            );

            setDeviceName("");
            setPlatformVersion("");
            setUdid("");

            return;
        }

        setPlatformName(
            profile.deviceProfile
                .platformName,
        );

        setDeviceName(
            profile.deviceProfile
                .deviceName,
        );

        setPlatformVersion(
            profile.deviceProfile
                .platformVersion,
        );

        setUdid(
            profile.deviceProfile
                .udid,
        );
    }, [
        profile,
        open,
    ]);

    if (!profile) {
        return null;
    }

    function addVariable() {
        setVariables(
            (current) => [
                ...current,
                {
                    key: "",
                    value: "",
                    secret: false,
                },
            ],
        );
    }

    function updateVariable(
        index: number,
        field:
            | "key"
            | "value"
            | "secret",
        value:
            | string
            | boolean,
    ) {
        setVariables(
            (current) =>
                current.map(
                    (
                        variable,
                        variableIndex,
                    ) =>
                        variableIndex ===
                            index
                            ? {
                                ...variable,
                                [field]:
                                    value,
                            }
                            : variable,
                ),
        );
    }

    function removeVariable(
        index: number,
    ) {
        setVariables(
            (current) =>
                current.filter(
                    (
                        _,
                        variableIndex,
                    ) =>
                        variableIndex !==
                        index,
                ),
        );
    }

    function handleSave() {
        const nextVariables =
            Object.fromEntries(
                variables
                    .filter(
                        (variable) =>
                            variable.key.trim()
                                .length > 0,
                    )
                    .map(
                        (variable) => {
                            const key =
                                variable.key.trim();

                            return [
                                key,
                                {
                                    value:
                                        variable.value,

                                    secret:
                                        variable.secret,
                                },
                            ] as const;
                        },
                    ),
            );

        const normalizedDeviceName =
            deviceName.trim();

        const normalizedPlatformVersion =
            platformVersion.trim();

        const normalizedUdid =
            udid.trim();

        const hasDeviceProfile =
            normalizedDeviceName.length > 0 ||
            normalizedPlatformVersion.length > 0 ||
            normalizedUdid.length > 0;

        const nextProfile:
            EnvironmentProfile = {
            name:
                activeEnvironment,

            variables:
                nextVariables,

            ...(hasDeviceProfile
                ? {
                    deviceProfile: {
                        platformName,

                        deviceName:
                            normalizedDeviceName,

                        platformVersion:
                            normalizedPlatformVersion,

                        udid:
                            normalizedUdid,
                    },
                }
                : {}),
        };

        updateEnvironment(
            nextProfile,
        );

        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            width={680}
        >
            <DialogHeader
                title="Environment Configuration"
                subtitle={`Configure ${activeEnvironment} variables and device profile.`}
            />

            <DialogBody>
                <section>
                    <Label>
                        Environment
                    </Label>

                    <Select
                        value={
                            activeEnvironment
                        }
                        disabled
                    >
                        {environmentNames.map(
                            (
                                name,
                            ) => (
                                <option
                                    key={
                                        name
                                    }
                                    value={
                                        name
                                    }
                                >
                                    {name}
                                </option>
                            ),
                        )}
                    </Select>
                </section>

                <section>
                    <Label>
                        Variables
                    </Label>

                    <div
                        style={{
                            display:
                                "flex",

                            flexDirection:
                                "column",

                            gap:
                                10,
                        }}
                    >
                        {variables.map(
                            (
                                variable,
                                index,
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr auto",

                                        gap:
                                            8,

                                        alignItems:
                                            "end",
                                    }}
                                >
                                    <Input
                                        label="Name"
                                        value={
                                            variable.key
                                        }
                                        placeholder="baseUrl"
                                        onChange={(
                                            event,
                                        ) =>
                                            updateVariable(
                                                index,
                                                "key",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    <Input
                                        label="Value"
                                        type={
                                            variable.secret
                                                ? "password"
                                                : "text"
                                        }
                                        value={
                                            variable.value
                                        }
                                        placeholder={
                                            variable.secret
                                                ? "Enter secret value"
                                                : "https://example.com"
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateVariable(
                                                index,
                                                "value",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    <Button
                                        onClick={() =>
                                            removeVariable(
                                                index,
                                            )
                                        }
                                    >
                                        Remove
                                    </Button>

                                    <label
                                        style={{
                                            gridColumn:
                                                "1 / -1",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap:
                                                6,

                                            fontSize:
                                                12,

                                            color:
                                                "#8B949E",

                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                variable.secret
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateVariable(
                                                    index,
                                                    "secret",
                                                    event
                                                        .target
                                                        .checked,
                                                )
                                            }
                                        />

                                        Secret
                                    </label>
                                </div>
                            ),
                        )}

                        <Button
                            onClick={
                                addVariable
                            }
                        >
                            Add Variable
                        </Button>
                    </div>
                </section>

                <section>
                    <Label>
                        Device Profile
                    </Label>

                    <div
                        style={{
                            display:
                                "flex",

                            flexDirection:
                                "column",

                            gap:
                                10,
                        }}
                    >
                        <Select
                            value={
                                platformName
                            }
                            onChange={(
                                event,
                            ) => {
                                const nextPlatform =
                                    event.target.value as
                                    | "Android"
                                    | "iOS";

                                setPlatformName(
                                    nextPlatform,
                                );

                                setDeviceName("");
                                setPlatformVersion("");
                                setUdid("");
                            }}
                        >
                            <option value="Android">
                                Android
                            </option>

                            <option value="iOS">
                                iOS
                            </option>
                        </Select>

                        <Input
                            label="Device Name"
                            value={
                                deviceName
                            }
                            placeholder="Any supported device"
                            onChange={(
                                event,
                            ) =>
                                setDeviceName(
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />

                        <Input
                            label="Platform Version"
                            value={
                                platformVersion
                            }
                            placeholder="15"
                            onChange={(
                                event,
                            ) =>
                                setPlatformVersion(
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />

                        <Input
                            label="UDID"
                            value={
                                udid
                            }
                            placeholder="Optional device UDID"
                            onChange={(
                                event,
                            ) =>
                                setUdid(
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>
                </section>
            </DialogBody>

            <DialogFooter>
                <Button
                    onClick={
                        onClose
                    }
                >
                    Cancel
                </Button>

                <Button
                    onClick={
                        handleSave
                    }
                >
                    Save
                </Button>
            </DialogFooter>
        </Modal>
    );
}