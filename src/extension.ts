import { type ExtensionContext } from 'vscode';

import { isRichPresenceEnabled } from '@config';
import { RPC } from '@rpc';
import { loadCommonCommands } from '@commonCommands';
import { loadContextMenuUtils } from '@contextMenuUtils';
import { loadExperiments } from '@experiments';
import { StatusItems } from '@statusItems';

export let rpc: RPC | undefined;
export let extensionContext: ExtensionContext;
export const statusItems = StatusItems.load();

export function activate(context: ExtensionContext) {
    extensionContext = context;

    if (isRichPresenceEnabled())
        rpc = new RPC().connect();

    const { subscriptions } = context;
    
    loadCommonCommands(subscriptions);
    loadContextMenuUtils(subscriptions);
    loadExperiments(subscriptions);
}

export async function deactivate() {
    await rpc?.destroy();
}
