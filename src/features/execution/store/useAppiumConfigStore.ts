import { create } from "zustand";

export interface DeviceConfig {
  deviceName: string;
  platformVersion: string;
  udid: string;
}

export interface AppiumConfig {
  serverUrl: string;

  android: DeviceConfig;

  ios: DeviceConfig;
}

interface AppiumConfigState {
  config: AppiumConfig;

  updateConfig(
    config: Partial<AppiumConfig>,
  ): void;
}

export const useAppiumConfigStore =
  create<AppiumConfigState>((set) => ({
    config: {
      serverUrl: "http://127.0.0.1:4723",

      android: {
        deviceName: "Android Emulator",
        platformVersion: "",
        udid: "",
      },

      ios: {
        deviceName: "iPhone 17 Pro",
        platformVersion: "",
        udid: "",
      },
    },

    updateConfig(config) {
      set((state) => ({
        config: {
          ...state.config,
          ...config,
        },
      }));
    },
  }));