import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { executeFlow } from "../engine/executeFlow";
import { useExecutionStore } from "../store/useExecutionStore";
import { appiumClient } from "../services/appium/AppiumClient";

export class ExecutionController {
    static async run(
        nodes: FlowNode[],
        context: ExecutionContext,
    ) {
        // Pastikan setiap execution
        // menggunakan Appium session baru.
        await appiumClient.deleteSession();

        // Jalankan flow.
        // Session yang dibuat oleh Launch App
        // akan tetap aktif setelah execution selesai
        // agar bisa digunakan oleh Element Inspector.
        await executeFlow(
            nodes,
            context,
        );
    }

    static pause() {
        useExecutionStore
            .getState()
            .pauseExecution();
    }

    static resume() {
        useExecutionStore
            .getState()
            .resumeExecution();
    }

    static stop() {
        useExecutionStore
            .getState()
            .stopExecution();
    }
}