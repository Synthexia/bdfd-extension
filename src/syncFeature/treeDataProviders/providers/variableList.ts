import {
    type TreeDataProvider,
    type ProviderResult,
    TreeItem,
    TreeItemCollapsibleState
} from "vscode";

import { Request } from "@synthexia/bdfd-external";

import { ICON } from "@treeDataProviders/consts";
import { COMMAND } from "@syncFeature/consts";

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
    constructor(public readonly variableData: Request.Response.VariableList & { botReference: string }) {
        const { id, name, value, botReference } = variableData;

        super(name || 'Unnamed variable', TreeItemCollapsibleState.None);
        this.tooltip = value || 'No value';
        this.iconPath = ICON.DATABASE;
        this.contextValue = 'bdfd-variable';
    }
}
