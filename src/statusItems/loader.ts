import type { LanguageStatusItem, StatusBarItem } from "vscode";
import { StatusItems } from ".";

export const loadStatusItems = (): (LanguageStatusItem | StatusBarItem)[] => [
    StatusItems.initFunctionListItem(),
    StatusItems.initCustomizeTokensItem(),
    StatusItems.initSyncFeatureItem(),
    StatusItems.initExtensionVersionItem(),
    StatusItems.initCurrentSyncedCommandItem()
];
