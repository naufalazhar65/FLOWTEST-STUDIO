import type { NodeType } from "../../flow/types/NodePlugin";

import type { NodeEmitter } from "../types/NodeEmitter";

import { assertEmitter } from "../emitters/AssertEmitter";
import { backEmitter } from "../emitters/BackEmitter";
import { closeAppEmitter } from "../emitters/CloseAppEmitter";
import { delayEmitter } from "../emitters/DelayEmitter";
import { doubleTapEmitter } from "../emitters/DoubleTapEmitter";
import { dragEmitter } from "../emitters/DragEmitter";
import { getAttributeEmitter } from "../emitters/GetAttributeEmitter";
import { getCurrentActivityEmitter } from "../emitters/GetCurrentActivityEmitter";
import { getCurrentPackageEmitter } from "../emitters/GetCurrentPackageEmitter";
import { getDeviceNameEmitter } from "../emitters/GetDeviceNameEmitter";
import { getDeviceTimeEmitter } from "../emitters/GetDeviceTimeEmitter";
import { getDisplayedEmitter } from "../emitters/GetDisplayedEmitter";
import { getEnabledEmitter } from "../emitters/GetEnabledEmitter";
import { getLocationEmitter } from "../emitters/GetLocationEmitter";
import { getOrientationEmitter } from "../emitters/GetOrientationEmitter";
import { getPlatformVersionEmitter } from "../emitters/GetPlatformVersionEmitter";
import { getRectEmitter } from "../emitters/GetRectEmitter";
import { getSelectedEmitter } from "../emitters/GetSelectedEmitter";
import { getSizeEmitter } from "../emitters/GetSizeEmitter";
import { getTextEmitter } from "../emitters/GetTextEmitter";
import { homeEmitter } from "../emitters/HomeEmitter";
import { inputEmitter } from "../emitters/InputEmitter";
import { launchAppEmitter } from "../emitters/LaunchAppEmitter";
import { longPressEmitter } from "../emitters/LongPressEmitter";
import { screenshotEmitter } from "../emitters/ScreenshotEmitter";
import { scrollEmitter } from "../emitters/ScrollEmitter";
import { swipeEmitter } from "../emitters/SwipeEmitter";
import { tapEmitter } from "../emitters/TapEmitter";
import { zoomEmitter } from "../emitters/ZoomEmitter";
import { flingEmitter } from "../emitters/FlingEmitter";
import { pinchEmitter } from "../emitters/PinchEmitter";
import { elementExistsEmitter } from "../emitters/ElementExistsEmitter";
import { setVariableEmitter } from "../emitters/SetVariableEmitter";
import { waitEmitter } from "../emitters/WaitEmitter";
import { pressReturnEmitter } from "../emitters/PressReturnEmitter";
import { hideKeyboardEmitter } from "../emitters/HideKeyboardEmitter";
import { ifEmitter } from "../emitters/IfEmitter";

export const emitterRegistry: Partial<
    Record<NodeType, NodeEmitter>
> = {
    tap: tapEmitter,

    input: inputEmitter,

    assert: assertEmitter,

    setVariable: setVariableEmitter,

    if: ifEmitter,

    delay: delayEmitter,

    wait: waitEmitter,

    swipe: swipeEmitter,

    scroll: scrollEmitter,

    launchApp: launchAppEmitter,

    closeApp: closeAppEmitter,

    back: backEmitter,

    home: homeEmitter,

    pressReturn: pressReturnEmitter,

    hideKeyboard: hideKeyboardEmitter,

    screenshot: screenshotEmitter,

    longPress: longPressEmitter,

    doubleTap: doubleTapEmitter,

    drag: dragEmitter,

    pinch: pinchEmitter,

    fling: flingEmitter,

    zoom: zoomEmitter,

    // Element getters
    getText: getTextEmitter,

    elementExists:
        elementExistsEmitter,

    getAttribute: getAttributeEmitter,

    getDisplayed: getDisplayedEmitter,

    getEnabled: getEnabledEmitter,

    getSelected: getSelectedEmitter,

    getLocation: getLocationEmitter,

    getSize: getSizeEmitter,

    getRect: getRectEmitter,

    // Device getters
    getCurrentActivity:
        getCurrentActivityEmitter,

    getCurrentPackage:
        getCurrentPackageEmitter,

    getOrientation:
        getOrientationEmitter,

    getPlatformVersion:
        getPlatformVersionEmitter,

    getDeviceName:
        getDeviceNameEmitter,

    getDeviceTime:
        getDeviceTimeEmitter,
};