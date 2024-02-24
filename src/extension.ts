import { workspace, type ExtensionContext } from 'vscode';

import { loadExperiments } from './experiments/loader';
import { loadContextMenuUtils } from './contextMenuUtils/loader';
import { loadCommonCommands } from './commonCommands/loader';
import { loadStatusItems } from './statusItems/loader';
import { RPC } from './rpc';
import { EXPERIMENT } from '@experiments/consts';

export let rpc: RPC | undefined;
export let extensionContext: ExtensionContext;
export const statusItems = loadStatusItems();

export function activate(context: ExtensionContext) {
    extensionContext = context;

    if (workspace.getConfiguration().get(EXPERIMENT.RICH_PRESENCE))
        rpc = new RPC().connect();

    const { subscriptions } = context;
    
    loadCommonCommands(subscriptions);
    loadContextMenuUtils(subscriptions);
    loadExperiments(subscriptions);
}

export async function deactivate() {
    await rpc?.destroy();
}
