import type { DelayNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

export const delayEmitter =
    createSimpleEmitter<DelayNodeData>(
        "delay",

        (data) => [
            String(data.duration),
        ],
    );