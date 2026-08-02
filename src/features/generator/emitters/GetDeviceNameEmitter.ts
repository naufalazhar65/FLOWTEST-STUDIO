import type { GetDeviceNameNodeData } from "../../flow/types/flowNode";
import { createDeviceGetterEmitter } from "../factories/createDeviceGetterEmitter";

export const getDeviceNameEmitter =
    createDeviceGetterEmitter<GetDeviceNameNodeData>(
        "get_device_name",
    );