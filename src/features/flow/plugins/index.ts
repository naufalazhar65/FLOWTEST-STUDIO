import { tapNode } from "./Tap";
import { inputNode } from "./Input";
import { assertNode } from "./Assert";
import { setVariableNode } from "./SetVariable";
import { delayNode } from "./Delay";
import { swipeNode } from "./Swipe";
import { scrollPlugin } from "./Scroll";
import { waitPlugin } from "./Wait";
import { launchAppPlugin } from "./LaunchApp";
import { closeAppPlugin } from "./CloseApp";
import { backPlugin } from "./Back";
import { homePlugin } from "./Home";
import { screenshotPlugin } from "./Screenshot";
import { ifPlugin } from "./If";
import { getTextNode } from "./GetText";
import { elementExistsNode } from "./ElementExists";
import { getAttributeNode } from "./GetAttribute";
import { getCurrentActivityPlugin } from "./getCurrentActivityPlugin";
import { getCurrentPackagePlugin } from "./getCurrentPackagePlugin";
import { getOrientationPlugin } from "./getOrientationPlugin/plugin";
import { getPlatformVersionPlugin } from "./getPlatformVersionPlugin";
import { getDeviceNamePlugin } from "./getDeviceNamePlugin";
import { getDeviceTimePlugin } from "./getDeviceTimePlugin";
import { getDisplayedPlugin } from "./getDisplayedPlugin";
import { getEnabledPlugin } from "./getEnabledPlugin";
import { getSelectedPlugin } from "./getSelectedPlugin";
import { getLocationPlugin } from "./getLocationPlugin";
import { getSizePlugin } from "./getSizePlugin";
import { getRectPlugin } from "./getRectPlugin";





import type { NodePlugin } from "../types/NodePlugin";

export const plugins: NodePlugin[] = [
  tapNode,
  inputNode,
  assertNode,
  setVariableNode,
  delayNode,
  swipeNode,
  scrollPlugin,
  waitPlugin,
  launchAppPlugin,
  closeAppPlugin,
  backPlugin,
  homePlugin,
  screenshotPlugin,
  ifPlugin,

  // Element Getter
  getTextNode,
  elementExistsNode,
  getAttributeNode,
  getDisplayedPlugin,
  getEnabledPlugin,
  getSelectedPlugin,

  // Device Getter
  getCurrentActivityPlugin,
  getCurrentPackagePlugin,
  getOrientationPlugin,
  getPlatformVersionPlugin,
  getDeviceNamePlugin,
  getDeviceTimePlugin,
  getLocationPlugin,
  getSizePlugin,
  getRectPlugin,
];