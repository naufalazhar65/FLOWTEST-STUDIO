import type { LongPressNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const longPressEmitter =
    createLocatorEmitter<LongPressNodeData>(
        "long_press",

        (data) => [
            String(
                data.duration,
            ),
        ],
    );