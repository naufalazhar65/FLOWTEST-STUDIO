import type { TapNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const tapEmitter =
    createLocatorEmitter<TapNodeData>(
        "tap",
    );