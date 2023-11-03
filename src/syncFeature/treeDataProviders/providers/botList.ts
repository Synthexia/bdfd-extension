import { TreeDataProvider, TreeItem, ProviderResult, TreeItemCollapsibleState } from "vscode";

import { Request } from "@synthexia/bdfd-external";

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
    constructor(public readonly botData: Request.Response.BotList) {
        const { name, commandCount, variableCount } = botData;

        super(name, TreeItemCollapsibleState.None);
        this.tooltip = `${commandCount} | ${variableCount}`;
        this.iconPath = ICON.BOT;
    }
}
