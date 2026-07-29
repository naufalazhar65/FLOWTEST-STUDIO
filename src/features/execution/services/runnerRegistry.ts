import { tapRunner } from "../runners/TapRunner";
import { inputRunner } from "../runners/InputRunner";
import { assertRunner } from "../runners/AssertRunner";
import { setVariableRunner } from "../runners/SetVariableRunner";
import { delayRunner } from "../runners/DelayRunner";

import type { NodeRunner } from "../types/NodeRunner";
import type { NodeAction } from "../../flow/types/flowNode";
import { swipeRunner } from "../runners/SwipeRunner";
import { scrollRunner } from "../runners/ScrollRunner";
import { waitRunner } from "../runners/WaitRunner";
import { launchAppRunner } from "../runners/LaunchAppRunner";
import { closeAppRunner } from "../runners/CloseAppRunner";
import { backRunner } from "../runners/BackRunner";
import { homeRunner } from "../runners/HomeRunner";
import { screenshotRunner } from "../runners/ScreenshotRunner";
import { ifRunner } from "../runners/IfRunner";
import { getTextRunner } from "../runners/GetTextRunner";
import { elementExistsRunner } from "../runners/ElementExistsRunner";
import { getAttributeRunner } from "../runners/GetAttributeRunner";
import { getCurrentActivityRunner } from "../runners/GetCurrentActivityRunner";
import { getCurrentPackageRunner } from "../runners/GetCurrentPackageRunner"
import { getOrientationRunner } from "../runners/GetOrientationRunner";
import { getPlatformVersionRunner } from "../runners/GetPlatformVersionRunner";
import { getDeviceNameRunner } from "../runners/GetDeviceNameRunner";
import { getDeviceTimeRunner } from "../runners/GetDeviceTimeRunner";

const registry = new Map<NodeAction, NodeRunner>([
  ["tap", tapRunner],
  ["input", inputRunner],
  ["assert", assertRunner],
  ["setVariable", setVariableRunner],
  ["delay", delayRunner],
  ["swipe", swipeRunner],
  ["scroll", scrollRunner],
  ["wait", waitRunner],

  ["launchApp", launchAppRunner],
  ["closeApp", closeAppRunner],
  ["back", backRunner],
  ["home", homeRunner],
  ["screenshot", screenshotRunner],
  ["if", ifRunner],
  ["getText", getTextRunner],
  ["elementExists", elementExistsRunner],
  ["getAttribute", getAttributeRunner],
  ["getCurrentActivity", getCurrentActivityRunner],
  ["getCurrentPackage", getCurrentPackageRunner],
  ["getOrientation", getOrientationRunner],
  ["getPlatformVersion", getPlatformVersionRunner],
  ["getDeviceName", getDeviceNameRunner],
  ["getDeviceTime", getDeviceTimeRunner]
]);

export function getRunner(
  action: NodeAction
): NodeRunner {
  const runner = registry.get(action);

  if (!runner) {
    throw new Error(
      `No runner registered for ${action}`
    );
  }

  return runner;
}