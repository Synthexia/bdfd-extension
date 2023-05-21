import {
    languages,
    extensions,
    DocumentSelector
} from "vscode";
import l from '../locale';
import { ITEM } from "./consts";
import { COMMAND as COMMON_COMMAND } from "../commonCommands/consts";
import { COMMAND as SYNC_COMMAND } from "../syncFeature/consts";
import {
    EXTENSION_ID,
    LANG
} from "../generalConsts";

const statusItem = languages.createLanguageStatusItem;

export class StatusItems {
    private static selector: DocumentSelector = {
        language: LANG
    };

    public static initExtensionVersionItem() {
        const extensionVersion = extensions.getExtension(EXTENSION_ID)!.packageJSON.version;

        const item = statusItem(ITEM.EXTENSION_VERSION.ID, this.selector);

        item.name = ITEM.NAME;
        item.text = extensionVersion;
        item.detail = l.bars.version.text;

        return item;
    }

    public static initCustomizeTokensItem() {
        const item = statusItem(ITEM.CUSTOMIZE_TOKENS.ID, this.selector);

        item.name = ITEM.NAME;
        item.text = l.bars.customize.text;
        item.command = {
            title: l.bars.customize.commandTitle,
            command: COMMON_COMMAND.TOKEN_CUSTOMIZATION
        };

        return item;
    }

    public static initSyncFeatureItem() {
        const item = statusItem(ITEM.SYNC_FEATURE.ID, this.selector);

        item.name = ITEM.NAME;
        item.text = ITEM.SYNC_FEATURE.TEXT;
        item.command = {
            title: ITEM.SYNC_FEATURE.TITLE,
            command: SYNC_COMMAND.MODIFY.COMMAND_DATA
        };

        return item;
    }

    public static initFunctionListItem() {
        const item = statusItem(ITEM.FUNCTION_LIST.ID, this.selector);

        item.name = ITEM.NAME;
        item.text = l.bars.funcList.text;
        item.command = {
            title: l.bars.funcList.commandTitle,
            command: COMMON_COMMAND.FUNCTION_LIST
        };

        return item;
    }
}
