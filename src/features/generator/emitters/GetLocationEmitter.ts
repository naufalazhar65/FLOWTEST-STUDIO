import type { GetLocationNodeData } from "../../flow/types/flowNode";

import { createGetterEmitter } from "../factories/createGetterEmitter";

export const getLocationEmitter =
    createGetterEmitter<GetLocationNodeData>(
        "get_location",
    );