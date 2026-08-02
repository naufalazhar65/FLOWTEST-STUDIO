import type { GetCurrentPackageNodeData } from "../../flow/types/flowNode";
import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";

export const getCurrentPackageEmitter =
    createDeviceGetterEmitter<GetCurrentPackageNodeData>(
        "get_current_package",
    );