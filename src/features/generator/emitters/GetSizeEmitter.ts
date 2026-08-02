import type { GetSizeNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getSizeEmitter =
    createGetterEmitter<GetSizeNodeData>(
        "get_size",
    );