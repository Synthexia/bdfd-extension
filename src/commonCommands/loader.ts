import { type ExtensionContext, commands, extensions, window, workspace, QuickPickItem } from "vscode";

import { Functions } from "@synthexia/bpapi-wrapper";

import { COMMAND, EXAMPLE, KEY } from "./consts";

import * as localization from "../localization";

import { updateFunctionListState } from "../statusItems/stateUpdaters";
import { TextMateUpdateType } from "./enums";
import { EXTENSION_ID } from "../generalConsts";
import { actionCancelledNotification } from "../utils";

const { commonCommands: commonCommandsLoc } = localization;
const {
    customizeHighlighting: customizeHighlightingLoc,
    functionList: functionListLoc
 } = commonCommandsLoc;

declare namespace TextMate {
    interface Rule {
        name: string;
        scope: string;
        settings: Settings;
    }

    interface Settings {
        foreground: string;
        fontStyle: string;
    }

    interface Options {
        foreground: string;
        fontStyle: string;
        scope: string;
        label?: string;
    }

    interface QuickPickItem {
        description: string;
        foreground: string;
        fontStyle: string;
        scope: string;
        label: string;
        name?: string;
    }
}

const {
    showInformationMessage,
    showInputBox,
    showQuickPick
} = window;

export default function loadCommonCommands(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand(COMMAND.FUNCTION_LIST, functionList),
        commands.registerCommand(COMMAND.TOKEN_CUSTOMIZATION, tokenCustomization),
        commands.registerCommand(COMMAND.RESET_TOKEN_CUSTOMIZATION, resetTokenCustomization)
    );
}

async function functionList() {
    const selectedFunctionTag = await showQuickPick(await Functions.tagList(), {
        placeHolder: functionListLoc.select,
        matchOnDetail: true
    });
    if (!selectedFunctionTag)
        return actionCancelledNotification();

    updateFunctionListState(true);

    const {
        tag,
        description,
        intents,
        premium
    } = ( await Functions.info(selectedFunctionTag) )!;

    const message = `${tag} > ${description} | ${functionListLoc.intents}: ${intents}, ${functionListLoc.premium.text}: ${premium ? functionListLoc.premium.true : functionListLoc.premium.false}`;

    showInformationMessage(message);
        // TODO ^^^ New Open wiki action
    
    updateFunctionListState(false);
}

async function tokenCustomization() {
    function updateCustomization(customizedTokens: TextMate.Rule[], options: TextMate.Options, input: string, type: TextMateUpdateType) {
        customizedTokens.forEach((textMateRule) => {
            if (textMateRule.scope == options.scope) {
                switch (type) {
                    case TextMateUpdateType.Foreground:
                        textMateRule.settings.foreground = input;
                        break;
                    case TextMateUpdateType.Style:
                        textMateRule.settings.fontStyle = input;
                        break;
                }
            }
        });

        workspace.getConfiguration(KEY.EDITOR).update(KEY.OPTION, {
            textMateRules: customizedTokens
        }, true);
    }

    const textMateRules: TextMate.Rule[] = extensions.getExtension(EXTENSION_ID)!
        .packageJSON
        .contributes
        .configurationDefaults[KEY.FULL]
        .textMateRules;

    const categoriesForSelection = textMateRules.map((textMateRule) => <TextMate.QuickPickItem> {
        description: `${customizeHighlightingLoc.quickPick.foreground.color}: ${textMateRule.settings.foreground ?? customizeHighlightingLoc.quickPick.foreground.noColor} | ${customizeHighlightingLoc.quickPick.font.style}: ${textMateRule.settings.fontStyle ?? localization.commonCommands.customizeHighlighting.quickPick.font.noStyle}`,
        foreground: textMateRule.settings.foreground,
        fontStyle: textMateRule.settings.fontStyle,
        scope: textMateRule.scope,
        label: textMateRule.name
    });

    const selectedCategory = await showQuickPick(categoriesForSelection, { matchOnDetail: true });
    if (!selectedCategory)
        return actionCancelledNotification();

    const options: TextMate.Options = {
        foreground: selectedCategory.foreground,
        fontStyle: selectedCategory.fontStyle,
        scope: selectedCategory.scope,
        label: selectedCategory.name
    };

    const textMateRulesInCategory = [
        {
            label: customizeHighlightingLoc.quickPick.foreground.label,
            description: customizeHighlightingLoc.quickPick.foreground.change
        },
        {
            label: customizeHighlightingLoc.quickPick.font.label,
            description: customizeHighlightingLoc.quickPick.font.change
        }
    ] satisfies QuickPickItem[];

    const selectedTextMateRule = await showQuickPick(textMateRulesInCategory);
    if (!selectedTextMateRule)
        return actionCancelledNotification();

    const customizedTokens: TextMate.Rule[] = workspace.getConfiguration(KEY.FULL).textMateRules;

    switch (selectedTextMateRule.label) {
        case customizeHighlightingLoc.quickPick.foreground.label:
            const newForegroundColor = await showInputBox({
                title: customizeHighlightingLoc.inputBox.foreground.changing,
                value: options.foreground,
                placeHolder: `${customizeHighlightingLoc.inputBox.general.example}: ${EXAMPLE.COLOR}`
            });
            if (!newForegroundColor)
                return actionCancelledNotification();

            updateCustomization(customizedTokens, options, newForegroundColor, TextMateUpdateType.Foreground);
            break;
        case customizeHighlightingLoc.quickPick.font.label:
            const newFontStyle = await showInputBox({
                title: customizeHighlightingLoc.inputBox.font.changing,
                value: options.foreground,
                placeHolder: `${customizeHighlightingLoc.inputBox.general.example}: ${EXAMPLE.COLOR}`
            });
            if (!newFontStyle)
                return actionCancelledNotification();

            updateCustomization(customizedTokens, options, newFontStyle, TextMateUpdateType.Style);
            break;
    }
}

function resetTokenCustomization() {
    const textMateRules: TextMate.Rule[] = extensions.getExtension(EXTENSION_ID)!
        .packageJSON
        .contributes
        .configurationDefaults[KEY.FULL]
        .textMateRules;

    workspace.getConfiguration(KEY.EDITOR).update(KEY.OPTION, {
        textMateRules: textMateRules
    }, true);
}
