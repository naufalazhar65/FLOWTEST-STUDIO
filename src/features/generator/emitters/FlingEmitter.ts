import type { FlingNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const flingEmitter =
    createLocatorEmitter<FlingNodeData>(
        "fling",

        (data) => [
            `"${data.direction}"`,

            String(data.speed),
        ],
    );