import type { GetRectNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getRectEmitter =
    createGetterEmitter<GetRectNodeData>(
        "get_rect",
    );