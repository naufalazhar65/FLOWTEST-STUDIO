import type { GetDisplayedNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getDisplayedEmitter =
    createGetterEmitter<GetDisplayedNodeData>(
        "get_displayed",
    );