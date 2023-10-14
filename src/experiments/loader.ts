import { type ExtensionContext, workspace } from "vscode";
import { EXPERIMENT } from "./consts";
import loadSyncFeature from "../syncFeature/loader";
import loadAutoCompletionsFeature from "../autoCompletions/loader";

const getConfiguration = workspace.getConfiguration().get;

export default function loadExperiments(context: ExtensionContext) {
    if (getConfiguration(EXPERIMENT.AUTO_COMPLETIONS)) loadAutoCompletionsFeature(context);
    if (getConfiguration(EXPERIMENT.SYNC)) loadSyncFeature(context);
}
