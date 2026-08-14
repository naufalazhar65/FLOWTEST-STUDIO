import type { ElementExistsNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const elementExistsEmitter =
    createGetterEmitter<ElementExistsNodeData>(
        "element_exists",
    );