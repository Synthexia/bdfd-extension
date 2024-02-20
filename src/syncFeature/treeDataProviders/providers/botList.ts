import {
    type TreeDataProvider,
    type ProviderResult,
    TreeItem,
    TreeItemCollapsibleState
} from "vscode";

import { type Data } from "@synthexia/bdfd-external";

import { ICON } from "@treeDataProviders/consts";

export class BotList implements TreeDataProvider<BotItem> {
    constructor(public readonly botList: BotItem[]) {}

    public getTreeItem(element: BotItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    public getChildren(): ProviderResult<BotItem[]> {
        return this.botList;
    }
}

export class BotItem extends TreeItem {
    constructor(public readonly botData: Data.Bot.Base) {
        const { name, commandCount, variableCount } = botData;

        super(name, TreeItemCollapsibleState.None);
        this.tooltip = `${commandCount} | ${variableCount}`;
        this.iconPath = ICON.BOT;
    }
}
