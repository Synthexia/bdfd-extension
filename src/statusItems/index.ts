import {
    languages,
    extensions,
    DocumentSelector,
    window,
    StatusBarAlignment
} from "vscode";

import { EXTENSION_ID, LANG } from "@general/consts";
import { COMMAND as COMMON_COMMAND } from "@commonCommands/consts";
import { COMMAND as SYNC_FEATURE_COMMAND } from "@syncFeature/consts";

import { statusItems as statusItemsLoc } from "@localization";

import { ITEM } from "./consts";

const { createStatusBarItem } = window;
const { createLanguageStatusItem } = languages;
const selector: DocumentSelector = {
    language: LANG
};

export class StatusItems {
    public static load() {
        return [
            this.functionListItem(),
            this.customizeTokensItem(),
            this.syncFeatureItem(),
            this.extensionVersionItem(),
            this.currentSyncedCommandItem()
        ];
    }

    private static extensionVersionItem() {
        const extensionVersion = extensions.getExtension(EXTENSION_ID)!.packageJSON.version;

        const item = createLanguageStatusItem(ITEM.EXTENSION_VERSION.ID, selector);

        item.name = ITEM.NAME;
        item.text = extensionVersion;
        item.detail = statusItemsLoc.extensionVersion.text;

        return item;
    }

    private static customizeTokensItem() {
        const item = createLanguageStatusItem(ITEM.CUSTOMIZE_TOKENS.ID, selector);

        item.name = ITEM.NAME;
        item.text = statusItemsLoc.customizeHighlighting.text;
        item.command = {
            title: statusItemsLoc.customizeHighlighting.commandTitle,
            command: COMMON_COMMAND.TOKEN_CUSTOMIZATION
        };

        return item;
    }

    private static syncFeatureItem() {
        const item = createLanguageStatusItem(ITEM.SYNC_FEATURE.ID, selector);

        item.name = ITEM.NAME;
        item.text = ITEM.SYNC_FEATURE.TEXT;

        return item;
    }

    private static functionListItem() {
        const item = createLanguageStatusItem(ITEM.FUNCTION_LIST.ID, selector);

        item.name = ITEM.NAME;
        item.text = statusItemsLoc.functionList.text;
        item.command = {
            title: statusItemsLoc.functionList.commandTitle,
            command: COMMON_COMMAND.FUNCTION_LIST
        };

        return item;
    }

    private static currentSyncedCommandItem() {
        const item = createStatusBarItem('current-synced-command', StatusBarAlignment.Left);

        item.name = statusItemsLoc.currentSyncedCommand.name;
        item.command = SYNC_FEATURE_COMMAND.EDIT_COMMAND_DATA;
        item.hide();
        
        return item;
    }
}
