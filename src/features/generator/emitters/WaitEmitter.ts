import type { WaitNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const waitEmitter =
    createLocatorEmitter<WaitNodeData>(
        "wait_until_visible",

        (data) => [
            String(data.timeout / 1000),

            String(
                data.pollingInterval / 1000,
            ),
        ],
    );