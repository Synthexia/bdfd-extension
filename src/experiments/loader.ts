import { type ExtensionContext, workspace } from "vscode";

import { loadAutoCompletionsFeature } from "@autoCompletions";
import { loadSyncFeature } from "@syncFeature";

import { EXPERIMENT } from "./consts";

const getConfiguration = workspace.getConfiguration().get;

export function loadExperiments(subscriptions: ExtensionContext['subscriptions']) {
    if (getConfiguration(EXPERIMENT.AUTO_COMPLETIONS))
        loadAutoCompletionsFeature(subscriptions);
    if (getConfiguration(EXPERIMENT.SYNC))
        loadSyncFeature(subscriptions);
}
