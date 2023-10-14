import { TreeDataProvider, TreeItem, ProviderResult, TreeItemCollapsibleState } from "vscode";
import { ICON } from "../consts";
import { Request } from "@synthexia/bdfd-external";

export class VariableList implements TreeDataProvider<VariableItem> {
    constructor(public readonly variableList: VariableItem[]) {}

    public getTreeItem(element: VariableItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    public getChildren(): ProviderResult<VariableItem[]> {
        return this.variableList;
    }
}

export class VariableItem extends TreeItem {
    constructor(public readonly variableData: Request.Response.VariableList) {
        const { name, value } = variableData;

        super(name || 'Unnamed variable', TreeItemCollapsibleState.None);
        this.tooltip = value || 'No value';
        this.iconPath = ICON.DATABASE;
    }
}