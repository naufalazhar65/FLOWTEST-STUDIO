import type { HideKeyboardNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

export const hideKeyboardEmitter =
    createSimpleEmitter<HideKeyboardNodeData>(
        "hide_keyboard",
        () => [],
    );