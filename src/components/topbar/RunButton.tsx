import { useCallback } from "react";
import { Pause, Play, Square } from "lucide-react";

import { Button } from "../ui/Button";
import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";
import { ExecutionController } from "../../features/execution/services/ExecutionController";
import { useEnvironmentStore } from "../../features/environment/store/useEnvironmentStore";

export function RunButton() {
    const nodes = useFlowStore((state) => state.nodes);
    const edges = useFlowStore((state) => state.edges);
    const status = useExecutionStore((state) => state.status);
    const appiumConnection = useExecutionStore((state) => state.appiumConnection);
    const environmentName = useEnvironmentStore((state) => state.activeEnvironment);

    const handleRun = useCallback(async () => {
        await ExecutionController.run(
            nodes,
            { edges },
            {
                environmentName,
            }
        );
    }, [nodes, edges, environmentName]);

    const isConnected = appiumConnection === "connected";
    const isChecking = appiumConnection === "checking";

    // Determine label and disabled state for the primary button
    const getPrimaryButtonProps = () => {
        if (isChecking) {
            return {
                disabled: true,
                label: "Checking...",
                title: "Checking Appium connection…",
            };
        }
        if (!isConnected) {
            return {
                disabled: true,
                label: "Run",
                title: "Start Appium Server first.",
            };
        }
        return {
            disabled: false,
            label: status === "idle" ? "Run" : "Run Again",
            title: "",
        };
    };

    const primaryButton = getPrimaryButtonProps();

    // If running or paused, show control buttons
    if (status === "running" || status === "paused") {
        return (
            <div className="flex items-center gap-2">
                {status === "running" ? (
                    <Button onClick={() => ExecutionController.pause()}>
                        <Pause size={16} />
                        Pause
                    </Button>
                ) : (
                    <Button onClick={() => ExecutionController.resume()}>
                        <Play size={16} />
                        Resume
                    </Button>
                )}
                <Button onClick={() => ExecutionController.stop()} variant="secondary">
                    <Square size={16} />
                    Stop
                </Button>
            </div>
        );
    }

    // For idle, stopped, error, or any other status, show primary button
    return (
        <Button
            disabled={primaryButton.disabled}
            title={primaryButton.title}
            onClick={handleRun}
        >
            <Play size={16} />
            {primaryButton.label}
        </Button>
    );
}