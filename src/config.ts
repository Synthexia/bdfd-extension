import { workspace } from "vscode";

const { get } = workspace.getConfiguration();

export const Entry = {
    AutoCompletionsEnabled: 'BDFD.experiments.autoCompletions.enabled',
    SyncFeatureEnabled: 'BDFD.experiments.sync.enabled',
    RichPresenceEnabled: 'BDFD.syncFeature.richPresence.enabled'
} as const;

export const isAutoCompletionsEnabled = () => get<boolean>(Entry.AutoCompletionsEnabled, true);
export const isSyncFeatureEnabled = () => get<boolean>(Entry.SyncFeatureEnabled, true);
export const isRichPresenceEnabled = () => get<boolean>(Entry.RichPresenceEnabled, true);
