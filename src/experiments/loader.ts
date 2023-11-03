import { type ExtensionContext, workspace } from "vscode";

import { loadAutoCompletionsFeature } from "@autoCompletions";
import { loadSyncFeature } from "@syncFeature";

import { EXPERIMENT } from "./consts";

const getConfiguration = workspace.getConfiguration().get;

export function loadExperiments(context: ExtensionContext) {
    if (getConfiguration(EXPERIMENT.AUTO_COMPLETIONS))
        loadAutoCompletionsFeature(context);
    if (getConfiguration(EXPERIMENT.SYNC))
        loadSyncFeature(context);
}
