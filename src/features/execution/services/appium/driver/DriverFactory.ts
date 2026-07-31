import { AndroidDriver } from "./AndroidDriver";
import { IOSDriver } from "./IOSDriver";

import type {
  Driver,
  EnsureSession,
  SessionPost,
} from "./Driver";

export function createDriver(
  platform: "Android" | "iOS",
  ensureSession: EnsureSession,
  sessionPost: SessionPost,
): Driver {
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