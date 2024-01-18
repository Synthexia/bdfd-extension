import type { ExtensionContext } from 'vscode';

import { loadExperiments } from './experiments/loader';
import { loadContextMenuUtils } from './contextMenuUtils/loader';
import { loadCommonCommands } from './commonCommands/loader';
import { loadStatusItems } from './statusItems/loader';
import { RPC } from './rpc';

export const statusItems = loadStatusItems();
export const rpc = new RPC().login();

export let extensionContext: ExtensionContext;

export function activate(context: ExtensionContext) {
    extensionContext = context;

    const { subscriptions } = context;
    
    loadCommonCommands(subscriptions);
    loadContextMenuUtils(subscriptions);
    loadExperiments(subscriptions);
}

export async function deactivate() {
    await rpc.destroy();
}
