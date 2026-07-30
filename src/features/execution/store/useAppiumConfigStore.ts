import { create } from "zustand";

export interface AppiumConfig {
  serverUrl: string;

  platformName: "Android" | "iOS";

  automationName: string;

  deviceName: string;

  platformVersion: string;
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

      platformName: "Android",

      automationName: "UiAutomator2",

      deviceName: "Android Emulator",

      platformVersion: "",
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