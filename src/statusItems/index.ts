import {
    languages,
    extensions,
    DocumentSelector,
    window,
    StatusBarAlignment
} from "vscode";

import { EXTENSION_ID, LANG } from "../generalConsts";
import { ITEM } from "./consts";
import { COMMAND as COMMON_COMMAND } from "../commonCommands/consts";
import { COMMAND as SYNC_FEATURE_COMMAND } from "../syncFeature/consts";

import * as localization from "../localization";

const { statusItems: statusItemsLoc } = localization;

const { createStatusBarItem } = window;
const { createLanguageStatusItem } = languages;
const selector: DocumentSelector = {
    language: LANG
};

export class StatusItems {
    public static initExtensionVersionItem() {
        const extensionVersion = extensions.getExtension(EXTENSION_ID)!.packageJSON.version;

        const item = createLanguageStatusItem(ITEM.EXTENSION_VERSION.ID, selector);

        item.name = ITEM.NAME;
        item.text = extensionVersion;
        item.detail = statusItemsLoc.extensionVersion.text;

        return item;
    }

    public static initCustomizeTokensItem() {
        const item = createLanguageStatusItem(ITEM.CUSTOMIZE_TOKENS.ID, selector);

        item.name = ITEM.NAME;
        item.text = statusItemsLoc.customizeHighlighting.text;
        item.command = {
            title: statusItemsLoc.customizeHighlighting.commandTitle,
            command: COMMON_COMMAND.TOKEN_CUSTOMIZATION
        };

        return item;
    }

    public static initSyncFeatureItem() {
        const item = createLanguageStatusItem(ITEM.SYNC_FEATURE.ID, selector);

        item.name = ITEM.NAME;
        item.text = ITEM.SYNC_FEATURE.TEXT;

        return item;
    }

    public static initFunctionListItem() {
        const item = createLanguageStatusItem(ITEM.FUNCTION_LIST.ID, selector);

        item.name = ITEM.NAME;
        item.text = statusItemsLoc.functionList.text;
        item.command = {
            title: statusItemsLoc.functionList.commandTitle,
            command: COMMON_COMMAND.FUNCTION_LIST
        };

        return item;
    }

    public static initCurrentSyncedCommandItem() {
        const item = createStatusBarItem('current-synced-command', StatusBarAlignment.Left);

        item.name = statusItemsLoc.currentSyncedCommand.text;
        item.command = SYNC_FEATURE_COMMAND.EDIT_COMMAND_DATA;
        item.hide();
        
        return item;
    }
}
