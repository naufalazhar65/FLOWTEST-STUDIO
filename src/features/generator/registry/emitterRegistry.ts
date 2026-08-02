import { tapEmitter } from "../emitters/TapEmitter";
import { inputEmitter } from "../emitters/InputEmitter";
import { doubleTapEmitter } from "../emitters/DoubleTapEmitter";
import { longPressEmitter } from "../emitters/LongPressEmitter";
import { dragEmitter } from "../emitters/DragEmitter";

import type { NodeEmitter } from "../types/NodeEmitter";
import type { NodeType } from "../../flow/types/NodePlugin";
import { launchAppEmitter } from "../emitters/LaunchAppEmitter";
import { closeAppEmitter } from "../emitters/CloseAppEmitter";

export const emitterRegistry: Partial<
    Record<NodeType, NodeEmitter>
> = {
    tap: tapEmitter,

    input: inputEmitter,

    doubleTap:
        doubleTapEmitter,
    longPress:
        longPressEmitter,
    drag: dragEmitter,
    launchApp: launchAppEmitter,
    closeApp: closeAppEmitter,
};