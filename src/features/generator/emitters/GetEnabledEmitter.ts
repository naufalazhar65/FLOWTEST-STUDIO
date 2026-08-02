import type { GetEnabledNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getEnabledEmitter =
    createGetterEmitter<GetEnabledNodeData>(
        "get_enabled",
    );