import type { GetTextNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getTextEmitter =
    createGetterEmitter<GetTextNodeData>(
        "get_text",
    );