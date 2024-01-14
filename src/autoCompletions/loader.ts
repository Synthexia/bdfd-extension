import { Functions } from "@synthexia/bpapi-wrapper";

import {
    type ExtensionContext,
    CompletionItem,
    CompletionItemKind,
    MarkdownString,
    Range,
    SnippetString,
    languages,
    window
} from "vscode";

import { EMPTY, EMPTY_ARRAY, LANG, SPECIAL_CHARACTER } from "@general/consts";
import { autoCompletions as autoCompletionsLoc } from "@localization";

import { ARGUMENT, EXCEPTION_TAG, PARENTHESIS_REGEX, TABSTOP_PART } from "./consts";

const buildTabstop = (index: number, tabstopPart: string) =>
    SPECIAL_CHARACTER.DOLLAR.ESCAPED2 +
    SPECIAL_CHARACTER.LEFT_BRACE.NORMAL +
    index +
    tabstopPart +
    SPECIAL_CHARACTER.RIGHT_BRACE.NORMAL;

export async function loadAutoCompletionsFeature(subscriptions: ExtensionContext['subscriptions']) {
    const functionList = await Functions.list();
    const functionTagList = await Functions.tagList();

    const autoCompletionItems: CompletionItem[] = EMPTY_ARRAY;

    let functionIndex = 0;
    for (const info of functionList) {
        let { tag } = info;
        let currentArgument: string;
        let argumentList!: string;
        let argumentCount = 0;
        let tabstop: string;

        if (tag.includes(SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL)) {
            const splittedTag = tag
                .split(SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL)[1]
                .split(SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL)[0]
                .split(SPECIAL_CHARACTER.SEMICOLON.NORMAL);
            
            let argumentIndex = 0;
            for (const argument of splittedTag) {
                argumentIndex++;
                tabstop = `\${${argumentIndex}:${argument}}`;

                switch (argument) {
                    case ARGUMENT.NEW_ROW:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.NO_YES);
                        break;
                    case ARGUMENT.DISABLED:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.NO_YES);
                        break;
                    case ARGUMENT.REQUIRED:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.NO_YES);
                        break;
                    case ARGUMENT.STYLE:
                        if (
                            functionTagList[functionIndex] == EXCEPTION_TAG.ADD_BUTTON
                            ||
                            functionTagList[functionIndex] == EXCEPTION_TAG.EDIT_BUTTON
                        )
                            tabstop = buildTabstop(argumentIndex, TABSTOP_PART.BUTTON_STYLE);
                        else
                            tabstop = buildTabstop(argumentIndex, TABSTOP_PART.PARAGRAPH_STYLE);
                        break;
                    case ARGUMENT.INDEX.A:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.INDEX);
                        break;
                    case ARGUMENT.INDEX.B:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.INDEX);
                        break;
                    case ARGUMENT.TYPE.A:
                        switch (functionTagList[functionIndex]) {
                            case EXCEPTION_TAG.CREATE_CHANNEL:
                                tabstop = buildTabstop(argumentIndex, TABSTOP_PART.CHANNEL_TYPE);
                                break;
                            case EXCEPTION_TAG.ERROR:
                                tabstop = buildTabstop(argumentIndex, TABSTOP_PART.ERROR_TYPE);
                                break;
                            case EXCEPTION_TAG.GET_EMBED_DATA:
                                tabstop = buildTabstop(argumentIndex, TABSTOP_PART.EMBED_TYPE);
                                break;
                            case EXCEPTION_TAG.VARIABLES_COUNT:
                                tabstop = buildTabstop(argumentIndex, TABSTOP_PART.VARIABLE_TYPE);
                                break;
                        }
                        break;
                    case ARGUMENT.TYPE.B:
                        tabstop = buildTabstop(argumentIndex, TABSTOP_PART.MESSAGE_TYPE);
                        break;
                }

                tabstop = tabstop.replace(PARENTHESIS_REGEX, EMPTY);

                if (argumentIndex == 1)
                    tag = tag.replace(
                        SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL + argument,
                        SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL + tabstop
                    );
                else if (argumentIndex == splittedTag.length)
                    tag = tag.replace(
                        argument + SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL,
                        tabstop + SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL
                    );
                else
                    tag = tag.replace(
                        SPECIAL_CHARACTER.SEMICOLON.NORMAL + argument + SPECIAL_CHARACTER.SEMICOLON.NORMAL,
                        SPECIAL_CHARACTER.SEMICOLON.NORMAL + tabstop + SPECIAL_CHARACTER.SEMICOLON.NORMAL
                    );
            }
        }

        if (info.args) {
            for (const argument of info.args) {
                const { name, type } = argument;
                const flags = {
                    required: EMPTY,
                    empty: EMPTY
                };

                if (argument.required)
                    flags.required = autoCompletionsLoc.required;
                else
                    flags.required = autoCompletionsLoc.notRequired;

                if (argument.empty)
                    flags.empty = autoCompletionsLoc.canBeEmpty;
                else
                    flags.empty = autoCompletionsLoc.cannotBeEmpty;

                if (argument.enumData) {
                    const enumData = argument.enumData.join(', ');
                    currentArgument = `---\n**${autoCompletionsLoc.name}**: ${name}\n\n**${autoCompletionsLoc.type}**: ${type}\n\n**${autoCompletionsLoc.possibleValues}**: ${enumData}\n\n**${autoCompletionsLoc.flags}**: ${flags.required} & ${flags.empty}\n\n---`;
                }
                else
                    currentArgument = `---\n**${autoCompletionsLoc.name}**: ${name}\n\n**${autoCompletionsLoc.type}**: ${type}\n\n**${autoCompletionsLoc.flags}**: ${flags.required} & ${flags.empty}\n\n---`;

                argumentList += currentArgument;
                argumentCount = info.args.length;
            }
        }
        else
            argumentList = autoCompletionsLoc.noArguments;

        const documentation = '```bds\n' + functionTagList[functionIndex] + '\n```\n\n' + `#### ${autoCompletionsLoc.arguments} (${argumentCount})\n${argumentList}`;

        autoCompletionItems.push({
            label: functionTagList[functionIndex],
            insertText: new SnippetString(SPECIAL_CHARACTER.BACK_SLASH.NORMAL + tag),
            documentation: new MarkdownString(documentation),
            detail: info.description,
            kind: CompletionItemKind.Function
        });

        functionIndex++;
    }

    subscriptions.push(
        languages.registerCompletionItemProvider(LANG, {
            provideCompletionItems() {
                const selection = window.activeTextEditor!.selection;

                try {
                    autoCompletionItems.forEach((x) => x.range = new Range(
                        selection.active.line,
                        selection.active.character - 1,
                        selection.end.line,
                        selection.end.character - 1
                    ));
                    return autoCompletionItems;
                } catch {}
            }
        }, '$')
    );
}
