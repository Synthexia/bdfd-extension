import { commands, extensions, window, workspace } from "vscode";

import { Functions } from "@synthexia/bpapi-wrapper";

import {
    COLOR_EXAMPLE,
    COMMAND,
    EDITOR_KEY,
    EXTENSION_ID,
    FULL_KEY,
    NO_COLOR,
    NO_STYLE,
    OPTION_KEY,
    STYLE_EXAMPLE,
    TEXT_MATE_UPDATE_TYPE
} from "./consts";


import { statusItems } from "../extension";
import l from "../locale";
import localization from "../localization";
import { StatusItem } from "../statusItems/enums";

import type { CommonCommands } from "../../types";

const
    info = window.showInformationMessage,
    warn = window.showWarningMessage
;
const
    inputBox = window.showInputBox,
    quickPick = window.showQuickPick
;

export default function loadCommonCommands() {
    commands.registerCommand(COMMAND.FUNCTION_LIST, functionList);
    commands.registerCommand(COMMAND.TOKEN_CUSTOMIZATION, tokenCustomization);
    commands.registerCommand(COMMAND.RESET_TOKEN_CUSTOMIZATION, resetTokenCustomization);
}

async function functionList() {
    const items = await Functions.tagList();
    const item = await quickPick(items, {
        placeHolder: localization.commonCommands.functionList.select,
        matchOnDetail: true
    });

    if (!item) {
        warn(localization.general.actionCancelled);
        return;
    }

    statusItems[StatusItem.FunctionList].busy = true;

    const functionInfo = ( await Functions.info(item) )!;

    const message = `${functionInfo.tag} > ${functionInfo.description} | ${localization.commonCommands.functionList.intents}: ${functionInfo.intents}, ${localization.commonCommands.functionList.premium.text}: ${functionInfo.premium ? localization.commonCommands.functionList.premium.true : localization.commonCommands.functionList.premium.false}`;

    info(message);
    // TODO ^^^ New Open wiki action

    statusItems[StatusItem.FunctionList].busy = false;
}

function tokenCustomization() {
    function updateCustomization(customizedTokens: CommonCommands.TextMate.Rules[], options: CommonCommands.TextMate.Options, input: string, type: TEXT_MATE_UPDATE_TYPE) {
        customizedTokens.forEach(textMateRule => {
            if (textMateRule.scope == options.scope) {
                switch (type) {
                    case TEXT_MATE_UPDATE_TYPE.FOREGROUND:
                        textMateRule.settings.foreground = input;
                        break;
                    case TEXT_MATE_UPDATE_TYPE.STYLE:
                        textMateRule.settings.fontStyle = input;
                        break;
                }
            }
        });

        workspace.getConfiguration(EDITOR_KEY).update(OPTION_KEY, {
            textMateRules: customizedTokens
        }, true);
    }

    const textMateRules: CommonCommands.TextMate.Rules[] = extensions.getExtension(EXTENSION_ID)!.packageJSON.contributes.configurationDefaults[FULL_KEY].textMateRules;

    const items = textMateRules.map(textMateRule => <CommonCommands.TextMate.QuickPickItem> {
        description: `${l.customize.quickPick.foreground.color}: ${textMateRule.settings.foreground ?? NO_COLOR} | ${l.customize.quickPick.font.style}: ${textMateRule.settings.fontStyle ?? NO_STYLE}`,
        foreground: textMateRule.settings.foreground,
        fontStyle: textMateRule.settings.fontStyle,
        scope: textMateRule.scope,
        label: textMateRule.name
    });

    quickPick(
        items,
        {
            matchOnDetail: true
        }
    ).then(item => {
        if (!item) {
            warn(l.general.actionCancelled);
            return;
        }

        const options: CommonCommands.TextMate.Options = {
            foreground: item.foreground,
            fontStyle: item.fontStyle,
            scope: item.scope,
            label: item.name
        };

        quickPick(
            [
                {
                    label: l.customize.quickPick.foreground.foreground,
                    description: l.customize.quickPick.foreground.change
                },
                {
                    label: l.customize.quickPick.font.font,
                    description: l.customize.quickPick.font.change
                }
            ]
        ).then(item => {
            if (!item) {
                warn(l.general.actionCancelled);
                return;
            }

            const customizedTokens: CommonCommands.TextMate.Rules[] = workspace.getConfiguration(FULL_KEY).textMateRules;

            switch (item.label) {
                case l.customize.quickPick.foreground.foreground:
                    inputBox(
                        {
                            title: l.customize.quickPick.foreground.changing,
                            value: options.foreground,
                            placeHolder: `${l.customize.quickPick.general.example}: ${COLOR_EXAMPLE}`
                        }
                    ).then(input => {
                        if (!input) {
                            warn(l.general.actionCancelled);
                            return;
                        }

                        updateCustomization(customizedTokens, options, input, TEXT_MATE_UPDATE_TYPE.FOREGROUND);
                    });
                    break;
                case l.customize.quickPick.font.font:
                    inputBox(
                        {
                            title: l.customize.quickPick.font.changing,
                            value: options.fontStyle,
                            placeHolder: `${l.customize.quickPick.general.example}: ${STYLE_EXAMPLE}`
                        }
                    ).then(input => {
                        if (!input) {
                            warn(l.general.actionCancelled);
                            return;
                        }

                        updateCustomization(customizedTokens, options, input, TEXT_MATE_UPDATE_TYPE.STYLE);
                    });
                    break;
            }
        });
    });
}

function resetTokenCustomization() {
    const textMateRules: CommonCommands.TextMate.Rules[] = extensions.getExtension(EXTENSION_ID)!.packageJSON.contributes.configurationDefaults[FULL_KEY].textMateRules;

    workspace.getConfiguration(EDITOR_KEY).update(OPTION_KEY, {
        textMateRules: textMateRules
    }, true);
}
