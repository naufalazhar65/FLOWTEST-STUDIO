import { useAppiumConfigStore } from "../../../store/useAppiumConfigStore";

import { AndroidDriver } from "./AndroidDriver";
import { IOSDriver } from "./IOSDriver";

import type {
  Driver,
  EnsureSession,
  SessionPost,
} from "./Driver";

export function createDriver(
  ensureSession: EnsureSession,
  sessionPost: SessionPost,
): Driver {
  const platform =
    useAppiumConfigStore
      .getState()
      .config
      .platformName;

  return platform === "Android"
    ? new AndroidDriver(
        ensureSession,
        sessionPost,
      )
    : new IOSDriver(
        ensureSession,
        sessionPost,
      );
}