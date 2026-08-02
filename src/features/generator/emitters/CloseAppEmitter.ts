import type { CloseAppNodeData } from "../../flow/types/flowNode";

import { createEmitter } from "../factories/createEmitter";
import { quote } from "../utils/quote";

export const closeAppEmitter =
    createEmitter<CloseAppNodeData>(
        "close_app",

        (data) => {
            const args = [
                quote(data.platform),
            ];

            if (data.platform === "Android") {
                args.push(
                    quote(data.appPackage),
                );
            } else {
                args.push(
                    quote(data.bundleId),
                );
            }

            return args;
        },
    );