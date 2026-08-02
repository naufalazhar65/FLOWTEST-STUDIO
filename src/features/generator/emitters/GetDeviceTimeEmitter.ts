import type { GetDeviceTimeNodeData } from "../../flow/types/flowNode";

import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";

export const getDeviceTimeEmitter =
    createDeviceGetterEmitter<GetDeviceTimeNodeData>(
        "get_device_time",
    );