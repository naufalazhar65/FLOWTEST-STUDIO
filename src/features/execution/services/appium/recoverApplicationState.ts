import type {
    LaunchAppNodeData,
} from "../../../flow/types/flowNode";

import {
    appiumClient,
} from "./AppiumClient";

export async function recoverApplicationState(
    launchNode: LaunchAppNodeData,
): Promise<void> {
    await appiumClient.closeApp({
        platform:
            launchNode.platform,

        appPackage:
            launchNode.appPackage,

        bundleId:
            launchNode.bundleId,
    });

    await appiumClient.deleteSession();

    await appiumClient.launchApp({
        platform:
            launchNode.platform,

        appPackage:
            launchNode.appPackage,

        appActivity:
            launchNode.appActivity,

        bundleId:
            launchNode.bundleId,

        app:
            launchNode.app,

        noReset:
            launchNode.noReset,
    });
}