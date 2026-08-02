import type { DoubleTapNodeData } from "../../flow/types/flowNode";

import { createLocatorEmitter } from "../factories/createLocatorEmitter";

export const doubleTapEmitter =
    createLocatorEmitter<DoubleTapNodeData>(
        "double_tap",
    );