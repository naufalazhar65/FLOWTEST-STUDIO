import type { BackNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

export const backEmitter =
    createSimpleEmitter<BackNodeData>(
        "back",
        () => [],
    );