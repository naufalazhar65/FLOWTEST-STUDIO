import type { GetPlatformVersionNodeData } from "../../flow/types/flowNode";

import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";

export const getPlatformVersionEmitter =
    createDeviceGetterEmitter<GetPlatformVersionNodeData>(
        "get_platform_version",
    );