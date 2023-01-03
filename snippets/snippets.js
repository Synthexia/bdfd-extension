const vscode = require('vscode');
const lang = vscode.languages;
const kind = vscode.CompletionItemKind;
const range = new vscode.Range(new vscode.Position(0,0), new vscode.Position(0,1));

function snippets() {
    // $addButton[]
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$addButton[${1|no,yes|};${2:Button ID/URL};${3:Label};${4|primary,success,danger,secondary,link|};${5|no,yes|};${6:Emoji};${7:Message ID}]');
        completion.documentation = new vscode.MarkdownString('```bds\n$addButton[]\n```');
        completion.kind = kind.Function;
        completion.label = '$addButton';
        completion.detail = 'Adds button to the response.';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $sum[]
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$sum[${1:Numbers (separate with \";\")}]');
        completion.documentation = new vscode.MarkdownString('```bds\n$sum[]\n```');
        completion.kind = kind.Function;
        completion.label = '$sum';
        completion.detail = 'Returns the sum of entered numbers.';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $onlyIf[]
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$onlyIf[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y};${4:Error message}]');
        completion.documentation = new vscode.MarkdownString('```bds\n$onlyIf[]\n```');
        completion.kind = kind.Function;
        completion.label = '$onlyIf';
        completion.detail = 'Command can be used only if values are equal (==) or not equal (!=) or one of them is bigger (> or <) or one of them is equal or bigger (>= or <=).';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $addCmdReactions[]
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$addCmdReactions[${1:Emojis (separate with \";\")}]');
        completion.documentation = new vscode.MarkdownString('```bds\n$addCmdReactions[]\n```');
        completion.kind = kind.Function;
        completion.label = '$addCmdReactions';
        completion.detail = 'Allows you to auto-react to your message.';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $addEmoji[]
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$addEmoji[${1:Name};${2:Url};${3|no,yes|}]');
        completion.documentation = new vscode.MarkdownString('```bds\n$addCmdReactions[]\n```');
        completion.kind = kind.Function;
        completion.label = '$addEmoji';
        completion.detail = "Adds emoji to the server and if <return> is set to 'yes' the newly added emoji is returned.";
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $if[] ... $endif
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$endif');
        completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $endif\n```');
        completion.kind = kind.Function;
        completion.label = '$if';
        completion.detail = 'If Statement block';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $if[] ... $else ... $endif
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$else\n    ${5:Code (FALSE)}\n\\$endif');
        completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $else ... $endif\n```');
        completion.kind = kind.Function;
        completion.label = '$ife';
        completion.detail = 'If Statement block with $else';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $if[] ... $elseif[] ... $elseif[] ... $endif
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$elseif[${5:X}${6|==,!=,>=,>,<,<=|}${7:Y}]\n    ${8:Code (ELSEIF)}\n\\$elseif[${9:X}${10|==,!=,>=,>,<,<=|}${11:Y}]\n    ${12:Code (ELSEIF)}\n\\$endif');
        completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $elseif[] ... $elseif[] ... $endif\n```');
        completion.kind = kind.Function;
        completion.label = '$ifelif';
        completion.detail = 'If Statement block with $elseif';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $try ... $endtry
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$try\n    ${1:CODE}\n\\$endtry');
        completion.documentation = new vscode.MarkdownString('```bds\n$try ... $endtry\n```');
        completion.kind = kind.Function;
        completion.label = '$try';
        completion.detail = 'Try Block';
        completion.range = range;
    
        return [ completion ];
        }
    });
    // $try ... $catch ... $endtry
    lang.registerCompletionItemProvider('bds', { provideCompletionItems() {
        const completion = new vscode.CompletionItem();
        completion.insertText = new vscode.SnippetString('\\$try\n    ${1:CODE (TRY)}\n\\$catch\n    ${2:CODE (CATCH)}\n\\$endtry');
        completion.documentation = new vscode.MarkdownString('```bds\n$try ... $catch ... $endtry\n```');
        completion.kind = kind.Function;
        completion.label = '$tryc';
        completion.detail = 'Try Block with $catch';
        completion.range = range;
    
        return [ completion ];
        }
    });
}

module.exports = snippets;