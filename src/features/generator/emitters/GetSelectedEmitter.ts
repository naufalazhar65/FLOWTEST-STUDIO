import type { GetSelectedNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getSelectedEmitter =
    createGetterEmitter<GetSelectedNodeData>(
        "get_selected",
    );