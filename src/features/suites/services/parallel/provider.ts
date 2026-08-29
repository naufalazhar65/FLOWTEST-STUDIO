export interface DeviceCapability {
    platform: string;

    udid?: string;

    deviceName?: string;

    osVersion?: string;
}

export interface ExecutionScope {
    id: string;

    concurrency: number;
}

export interface DeviceSession {
    scopeId: string;

    providerId: string;

    capabilities: DeviceCapability;

    connectedAt: number;
}

export interface ReserveDeviceOptions {
    scope: ExecutionScope;

    capabilities?: DeviceCapability;
}

export interface DeviceProvider {
    readonly id: string;

    readonly name: string;

    supportsParallel: boolean;

    reserveDevice(
        options: ReserveDeviceOptions,
    ): Promise<DeviceSession>;

    releaseDevice(
        session: DeviceSession,
    ): Promise<void>;

    listDevices(): Promise<
        DeviceCapability[]
    >;
}

export interface ProviderAdapter {
    provider: DeviceProvider;

    createScope(
        concurrency: number,
    ): ExecutionScope;
}

export function createScope(
    concurrency: number,
): ExecutionScope {
    return {
        id:
            crypto.randomUUID(),

        concurrency:
            Math.max(
                1,
                Math.floor(
                    concurrency,
                ),
            ),
    };
}

export function createProviderAdapter(
    provider: DeviceProvider,
): ProviderAdapter {
    return {
        provider,

        createScope(
            concurrency: number,
        ): ExecutionScope {
            return createScope(
                concurrency,
            );
        },
    };
}
