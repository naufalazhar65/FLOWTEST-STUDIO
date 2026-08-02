import type { ScreenshotNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

import { quote } from "../utils/quote";

export const screenshotEmitter =
    createSimpleEmitter<ScreenshotNodeData>(
        "screenshot",

        (data) => [
            quote(data.fileName),
        ],
    );