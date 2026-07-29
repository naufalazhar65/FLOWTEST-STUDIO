export interface DeviceActionNodeData {
    title: string;
    subtitle: string;
}

export interface DeviceGetterNodeData
    extends DeviceActionNodeData {
    variableName: string;
}
