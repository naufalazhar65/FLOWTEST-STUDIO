import type { ZoomNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const zoomEmitter =
    createLocatorEmitter<ZoomNodeData>(
        "zoom",

        (data) => [
            String(data.percent),

            String(data.duration),
        ],
    );