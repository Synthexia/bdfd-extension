import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as l from '../locale';

// Shortcuts
const S = vscode.SnippetString,
lang = vscode.languages,
M = vscode.MarkdownString,
k = vscode.CompletionItemKind;

export function load() {
    fetch('https://botdesignerdiscord.com/public/api/function_list').then(async (value) => {
        const list: any[] = await value.json();

        fetch('https://botdesignerdiscord.com/public/api/function_tag_list').then(async (value) => {
            const tags: string[] = await value.json();

            const data: any[] = [];
            list.forEach((f, i) => {
                let snippet: string = f.tag,
                tabstop = '',
                arg = '',
                args = '',
                length = 0;
                
                if (snippet.includes('[')) {
                    snippet.split('[')[1].split(']')[0].split(';').forEach((argument: string, index: number, array: string[]) => {
                        index += 1;
                        tabstop = `\${${index}:${argument}}`;

                        switch (argument) {
                            case 'New row':
                                tabstop = `\${${index}|no,yes|}`;
                                break;
                            case 'Style':
                                if (tags[i] == '$addButton[]' || tags[i] == '$editButton[]') {
                                    tabstop = `\${${index}|primary,secondary,danger,success,link|}`;
                                } else {
                                    tabstop = `\${${index}|short,paragraph|}`;
                                };
                                break;
                            case '(Disabled':
                                tabstop = `\${${index}|no,yes|}`;
                                break;
                            case 'Required':
                                tabstop = `\${${index}|no,yes|}`;
                                break;
                            case '(Index)' || 'Embed index':
                                tabstop = `\${${index}|1,2,3,4,5,6,7,8,9,10|}`;
                                break;
                            case 'Type' || '(Type)':
                                if (tags[i] == '$createChannel[]') {
                                    tabstop = `\${${index}|category,stage,forum,text,voice|}`;
                                } else if (tags[i] == '$error[]') {
                                    tabstop = `\${${index}|command,source,message,row,column|}`;
                                } else if (tags[i] == '$getEmbedData[]') {
                                    tabstop = `\${${index}|timestamp,title,description,footer,color,image|}`;
                                } else if (tags[i] == '$getMessage[]') {
                                    tabstop = `\${${index}|content,authorID,username,avatar|}`;
                                } else if (tags[i] == '$variablesCount[]') {
                                    tabstop = `\${${index}|user,server,globaluser,channel|}`;
                                };
                                break;
                            case 'Condition':
                                tabstop = `\${${index}:X}\${${index+=1}|>,<,==,!=,>=,<=|}\${${index+=1}:Y}`;
                                break;
                        };

                        tabstop = tabstop.replace(/[\(\)]/, '');

                        if (index == 1) {
                            snippet = snippet.replace(`[${argument}`, `[${tabstop}`);
                        } else if (index == array.length) {
                            snippet = snippet.replace(`${argument}]`, `${tabstop}]`);
                        } else {
                            snippet = snippet.replace(`;${argument};`, `;${tabstop};`);
                        };
                    });
                };

                if (f.arguments) {
                    f.arguments.forEach((a: any) => {
                        const name = a.name,
                        type = a.type,
                        flags = {
                            required: '',
                            empty: ''
                        };
        
                        if (a.required) {
                            flags.required = l.completions.required_1;
                        } else {
                            flags.required = l.completions.required_2;
                        };
        
                        if (a.empty) {
                            flags.empty = l.completions.empty_1;
                        } else {
                            flags.empty = l.completions.empty_2;
                        };
        
                        if (a.enumData) {
                            const enumData = a.enumData.join(', ');
                            arg = `---\n**${l.completions.name}**: ${name}\n\n**${l.completions.type}**: ${type}\n\n**${l.completions.values}**: ${enumData}\n\n**${l.completions.flags}**: ${flags.required} & ${flags.empty}\n\n---`;
                        } else {
                            arg = `---\n**${l.completions.name}**: ${name}\n\n**${l.completions.type}**: ${type}\n\n**${l.completions.flags}**: ${flags.required} & ${flags.empty}\n\n---`;
                        };

                        args += arg;
                    });
                    length = f.arguments.length;
                } else {
                    args = l.completions.arguments_2;
                };

                const documentation = '```bds\n' + tags[i] + '\n```\n\n' + `#### ${l.completions.arguments_1} (${length})\n${args}`;

                data.push({
                    label: tags[i],
                    snippet: new S(`\\${snippet}`),
                    doc: new M(documentation),
                    det: f.shortDescription,
                    kind: k.Function
                });
            });

            registerCompletionItems(data, data.length)
        });
    });
}

function registerCompletionItems(items: any[], count: number) {
    items.forEach(items => {
		lang.registerCompletionItemProvider('bds', {
			provideCompletionItems() {
				const sel = vscode.window.activeTextEditor?.selection,
				range = new vscode.Range(<number>sel?.active.line, <number>sel?.active.character - 2, <number>sel?.end.line, <number>sel?.end.character);

				const completion = new vscode.CompletionItem(items.label);
				completion.insertText = items.snippet;
				completion.documentation = items.doc;
				completion.detail = items.det;
				completion.kind = items.kind;
				completion.range = range;

				return [completion];
			}
		});
	});

	// Completions Bar
    const completions_bar = vscode.languages.createLanguageStatusItem('bdfd-lsi-completions', { language: 'bds' });
    completions_bar.name = 'BDFD Extension';
    completions_bar.text = l.bars.completions.text;
    completions_bar.detail = `${l.bars.completions.detail}: ${count}`;
}