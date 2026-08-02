import type { GetCurrentActivityNodeData } from "../../flow/types/flowNode";

import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";

export const getCurrentActivityEmitter =
    createDeviceGetterEmitter<GetCurrentActivityNodeData>(
        "get_current_activity",
    );