import {
    type TreeDataProvider,
    type ProviderResult,
    TreeItem,
    TreeItemCollapsibleState
} from "vscode";

import { Request } from "@synthexia/bdfd-external";

import { ICON } from "@treeDataProviders/consts";

import { syncFeature as syncFeatureLoc } from "@localization";

const { label, tooltip } = syncFeatureLoc.treeViews.treeItems;

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
        const { name, value } = variableData;

        super(name || label.unnamedVariable, TreeItemCollapsibleState.None);
        this.tooltip = value || tooltip.noValue;
        this.iconPath = ICON.DATABASE;
        this.contextValue = 'bdfd-variable';
    }
}
