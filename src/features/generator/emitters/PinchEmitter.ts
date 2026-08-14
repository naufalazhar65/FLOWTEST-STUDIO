import type { PinchNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const pinchEmitter =
    createLocatorEmitter<PinchNodeData>(
        "pinch",

        (data) => [
            String(data.percent),

            String(data.duration),
        ],
    );