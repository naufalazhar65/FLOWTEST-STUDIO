import type { GetOrientationNodeData } from "../../flow/types/flowNode";

import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";
export const getOrientationEmitter =
    createDeviceGetterEmitter<GetOrientationNodeData>(
        "get_orientation",
    );