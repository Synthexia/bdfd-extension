import { TreeDataProvider, TreeItem, ProviderResult, TreeItemCollapsibleState } from "vscode";

import { Request } from "@synthexia/bdfd-external";

import { ICON } from "@treeDataProviders/consts";

export class CommandList implements TreeDataProvider<CommandItem> {
    constructor(public readonly commandList: CommandItem[]) {}

    public getTreeItem(element: CommandItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    public getChildren(): ProviderResult<CommandItem[]> {
        return this.commandList;
    }
}

export class CommandItem extends TreeItem {
    constructor(public readonly commandData: Request.Response.CommandList) {
        const { name, trigger } = commandData;

        super(name || 'Unnamed command', TreeItemCollapsibleState.None);
        this.description = trigger || 'Non-triggerable';
        this.iconPath = ICON.FILE;
    }
}
