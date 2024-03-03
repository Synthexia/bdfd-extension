import { type ExtensionContext } from "vscode";

import { isAutoCompletionsEnabled, isSyncFeatureEnabled } from "@config";
import { loadAutoCompletionsFeature } from "@autoCompletions";
import { loadSyncFeature } from "@syncFeature";

export function loadExperiments(subscriptions: ExtensionContext['subscriptions']) {
    if (isAutoCompletionsEnabled())
        loadAutoCompletionsFeature(subscriptions);
    if (isSyncFeatureEnabled())
        loadSyncFeature(subscriptions);
}
