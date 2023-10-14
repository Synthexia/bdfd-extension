import { TreeDataProvider, TreeItem, ProviderResult, TreeItemCollapsibleState } from "vscode";
import { ICON } from "../consts";
import { Request } from "@synthexia/bdfd-external";

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
        const { id, name, commandCount, variableCount } = botData;

        super(name, TreeItemCollapsibleState.None);
        this.tooltip = `${commandCount} | ${variableCount}`;
        this.iconPath = ICON.BOT;
    }
}