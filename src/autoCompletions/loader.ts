import {
    functionList,
    functionTagList
} from "@nightnutsky/bpapi";
import {
    EMPTY,
    EMPTY_ARRAY,
    LANG,
    SPECIAL_CHARACTER
} from "../generalConsts";
import {
    ARGUMENT,
    EXCEPTION_TAG,
    PARENTHESIS_REGEX,
    TABSTOP_PART
} from "./consts";
import {
    CompletionItem,
    CompletionItemKind,
    MarkdownString,
    Range,
    SnippetString,
    languages,
    window
} from "vscode";
import l from "../locale";

const buildTabstop = (index: number, tabstopPart: string) => SPECIAL_CHARACTER.DOLLAR.ESCAPED2 + SPECIAL_CHARACTER.LEFT_BRACE.NORMAL + index + tabstopPart + SPECIAL_CHARACTER.RIGHT_BRACE.NORMAL;

export default function loadAutoCompletionsFeature() {
    functionList().then(functionList => functionTagList().then(functionTagList => {
        let i = 0;
        const completionItems: CompletionItem[] = EMPTY_ARRAY;

        for (const functionInfo of functionList) {
            let
                tag = functionInfo.tag,
                arg = EMPTY,
                args = EMPTY,
                argumentCount = 0,
                tabstop = EMPTY
            ;

            if (tag.includes(SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL)) {
                let index = 0;
                const splittedTag = tag
                    .split(SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL)[1]
                    .split(SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL)[0]
                    .split(SPECIAL_CHARACTER.SEMICOLON.NORMAL)
                ;

                for (const argument of splittedTag) {
                    index++;
                    tabstop = `\${${index}:${argument}}`;

                    switch (argument) {
                        case ARGUMENT.NEW_ROW:
                            tabstop = buildTabstop(index, TABSTOP_PART.NO_YES);
                            break;
                        case ARGUMENT.DISABLED:
                            tabstop = buildTabstop(index, TABSTOP_PART.NO_YES);
                            break;
                        case ARGUMENT.REQUIRED:
                            tabstop = buildTabstop(index, TABSTOP_PART.NO_YES);
                            break;
                        case ARGUMENT.STYLE:
                            if (functionTagList[i] == EXCEPTION_TAG.ADD_BUTTON || functionTagList[i] == EXCEPTION_TAG.EDIT_BUTTON) {
                                tabstop = buildTabstop(index, TABSTOP_PART.BUTTON_STYLE);
                            } else {
                                tabstop = buildTabstop(index, TABSTOP_PART.PARAGRAPH_STYLE);
                            }
                            break;
                        case ARGUMENT.INDEX.A:
                            tabstop = buildTabstop(index, TABSTOP_PART.INDEX);
                            break;
                        case ARGUMENT.INDEX.B:
                            tabstop = buildTabstop(index, TABSTOP_PART.INDEX);
                            break;
                        case ARGUMENT.TYPE.A:
                            switch (functionTagList[i]) {
                                case EXCEPTION_TAG.CREATE_CHANNEL:
                                    tabstop = buildTabstop(index, TABSTOP_PART.CHANNEL_TYPE);
                                    break;
                                case EXCEPTION_TAG.ERROR:
                                    tabstop = buildTabstop(index, TABSTOP_PART.ERROR_TYPE);
                                    break;
                                case EXCEPTION_TAG.GET_EMBED_DATA:
                                    tabstop = buildTabstop(index, TABSTOP_PART.EMBED_TYPE);
                                    break;
                                case EXCEPTION_TAG.VARIABLES_COUNT:
                                    tabstop = buildTabstop(index, TABSTOP_PART.VARIABLE_TYPE);
                                    break;
                            }
                            break;
                        case ARGUMENT.TYPE.B:
                            tabstop = buildTabstop(index, TABSTOP_PART.MESSAGE_TYPE);
                            break;
                    }

                    tabstop = tabstop.replace(PARENTHESIS_REGEX, EMPTY);

                    if (index == 1) {
                        tag = tag.replace(
                            SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL + argument,
                            SPECIAL_CHARACTER.LEFT_BRACKET.NORMAL + tabstop
                        );
                    } else if (index == splittedTag.length) {
                        tag = tag.replace(
                            argument + SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL,
                            tabstop + SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL
                        );
                    } else {
                        tag = tag.replace(
                            SPECIAL_CHARACTER.SEMICOLON.NORMAL + argument + SPECIAL_CHARACTER.SEMICOLON.NORMAL,
                            SPECIAL_CHARACTER.SEMICOLON.NORMAL + tabstop + SPECIAL_CHARACTER.SEMICOLON.NORMAL
                        );
                    }
                }
            }

            if (functionInfo.args) {
                for (const argument of functionInfo.args) {
                    const
                        name = argument.name,
                        type = argument.type,
                        flags = {
                            required: EMPTY,
                            empty: EMPTY
                        }
                    ;

                    if (argument.required) {
                        flags.required = l.completions.required_1;
                    } else {
                        flags.required = l.completions.required_2;
                    }

                    if (argument.empty) {
                        flags.empty = l.completions.empty_1;
                    } else {
                        flags.empty = l.completions.empty_2;
                    }

                    if (argument.enumData) {
                        const enumData = argument.enumData.join(', ');
                        arg = `---\n**${l.completions.name}**: ${name}\n\n**${l.completions.type}**: ${type}\n\n**${l.completions.values}**: ${enumData}\n\n**${l.completions.flags}**: ${flags.required} & ${flags.empty}\n\n---`;
                    } else {
                        arg = `---\n**${l.completions.name}**: ${name}\n\n**${l.completions.type}**: ${type}\n\n**${l.completions.flags}**: ${flags.required} & ${flags.empty}\n\n---`;
                    }

                    args += arg;
                    argumentCount = functionInfo.args.length;
                }
            } else {
                args = l.completions.arguments_2;
            }

            const documentation = '```bds\n' + functionTagList[i] + '\n```\n\n' + `#### ${l.completions.arguments_1} (${argumentCount})\n${args}`;
            
            completionItems.push({
                label: functionTagList[i],
                insertText: new SnippetString(SPECIAL_CHARACTER.BACK_SLASH.NORMAL + tag),
                documentation: new MarkdownString(documentation),
                detail: functionInfo.description,
                kind: CompletionItemKind.Function
            });

            i++;
        }

        languages.registerCompletionItemProvider(LANG, {
            provideCompletionItems() {
                const selection = window.activeTextEditor!.selection;
                try {
                    completionItems.forEach(x => x.range = new Range(
                        selection.active.line,
                        selection.active.character - 2,
                        selection.end.line,
                        selection.end.character - 2
                    ));
                    return completionItems;
                } catch {}
            }
        });
    }));
}
