import type { PressReturnNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

export const pressReturnEmitter =
    createSimpleEmitter<PressReturnNodeData>(
        "press_return",
        () => [],
    );