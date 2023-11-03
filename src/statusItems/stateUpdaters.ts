import type { LanguageStatusItem, StatusBarItem } from "vscode";

import { statusItems } from "@extension";

import { StatusItem } from "./enums";

export function updateFunctionListState(isBusy: boolean) {
    const item = <LanguageStatusItem> statusItems[StatusItem.FunctionList];
    
    item.busy = isBusy;
}

export function updateCurrentSyncedCommandState(isSyncing: boolean) {
    const item = <StatusBarItem> statusItems[StatusItem.CurrentSyncedCommand];

    isSyncing
        ? item.text = item.text.replace('$(check)', '$(sync~spin)')
        : item.text = item.text.replace('$(sync~spin)', '$(check)');
}
