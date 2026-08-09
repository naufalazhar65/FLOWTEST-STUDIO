import {
    elementService,
} from "../../execution/services/appium/ElementService";

export async function getPageSource(): Promise<string> {
    return elementService.getPageSource();
}