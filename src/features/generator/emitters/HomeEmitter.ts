import type { HomeNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

export const homeEmitter =
    createSimpleEmitter<HomeNodeData>(
        "home",

        () => [],
    );