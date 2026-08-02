import type { LaunchAppNodeData } from "../../flow/types/flowNode";

import { createEmitter } from "../factories/createEmitter";

import { quote } from "../utils/quote";

export const launchAppEmitter =
    createEmitter<LaunchAppNodeData>(
        "launch_app",

        (data) => {
            const args = [
                quote(data.platform),
            ];

            if (data.platform === "Android") {
                args.push(
                    quote(data.appPackage),
                    quote(data.appActivity),
                );
            } else {
                args.push(
                    quote(data.bundleId),
                    quote(data.app),
                );
            }

            args.push(
                String(data.noReset),
            );

            return args;
        },
    );