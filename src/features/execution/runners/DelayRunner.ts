import type { NodeRunner } from "../types/NodeRunner";

export const delayRunner: NodeRunner = {
    async run(node) {
        console.log("🔥 DelayRunner started");

        if (node.data.action !== "delay") {
            throw new Error("Invalid node for DelayRunner");
        }

        const duration = Number(node.data.duration);

        console.log(`⏱ Waiting ${duration} ms...`);

        await new Promise<void>((resolve) =>
            setTimeout(resolve, duration)
        );

        console.log("✅ Wait finished");
    },
};