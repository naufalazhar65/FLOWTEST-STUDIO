import { useCallback } from "react";

import {
    Pause,
    Play,
    Square,
} from "lucide-react";

import { Button } from "../ui/Button";

import {
    useFlowStore,
} from "../../features/flow/store/useFlowStore";

import {
    useExecutionStore,
} from "../../features/execution/store/useExecutionStore";

import {
    ExecutionController,
} from "../../features/execution/services/ExecutionController";

import {
    useEnvironmentStore,
} from "../../features/environment/store/useEnvironmentStore";

export function RunButton() {
    const nodes =
        useFlowStore(
            (state) =>
                state.nodes,
        );

    const edges =
        useFlowStore(
            (state) =>
                state.edges,
        );

    const status =
        useExecutionStore(
            (state) =>
                state.status,
        );

    const appiumConnection =
        useExecutionStore(
            (state) =>
                state.appiumConnection,
        );

    const environmentName =
        useEnvironmentStore(
            (state) =>
                state.activeEnvironment,
        );

    const handleRun =
        useCallback(
            async () => {
                await ExecutionController.run(
                    nodes,
                    {
                        edges,
                    },
                    {
                        environmentName,
                    },
                );
            },
            [
                nodes,
                edges,
                environmentName,
            ],
        );

    if (
        status === "idle"
    ) {
        return (
            <Button
                disabled={
                    appiumConnection !==
                    "connected"
                }
                title={
                    appiumConnection ===
                        "connected"
                        ? ""
                        : "Start Appium Server first."
                }
                onClick={
                    handleRun
                }
            >
                <Play size={16} />

                {
                    appiumConnection ===
                        "checking"
                        ? "Checking..."
                        : "Run"
                }
            </Button>
        );
    }

    if (
        status === "running"
    ) {
        return (
            <>
                <Button
                    onClick={() =>
                        ExecutionController.pause()
                    }
                >
                    <Pause size={16} />
                    Pause
                </Button>

                <Button
                    onClick={() =>
                        ExecutionController.stop()
                    }
                >
                    <Square size={16} />
                    Stop
                </Button>
            </>
        );
    }

    if (
        status === "paused"
    ) {
        return (
            <>
                <Button
                    onClick={() =>
                        ExecutionController.resume()
                    }
                >
                    <Play size={16} />
                    Resume
                </Button>

                <Button
                    onClick={() =>
                        ExecutionController.stop()
                    }
                >
                    <Square size={16} />
                    Stop
                </Button>
            </>
        );
    }

    return (
        <Button
            disabled={
                appiumConnection !==
                "connected"
            }
            title={
                appiumConnection ===
                    "connected"
                    ? ""
                    : "Start Appium Server first."
            }
            onClick={
                handleRun
            }
        >
            <Play size={16} />
            Run Again
        </Button>
    );
}