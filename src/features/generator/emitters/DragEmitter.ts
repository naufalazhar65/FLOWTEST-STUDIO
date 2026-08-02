import type { DragNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const dragEmitter =
    createLocatorEmitter<DragNodeData>(
        "drag",
        (data) => [
            `"${data.direction}"`,
            String(data.distance),
            String(data.duration),
        ],
    );