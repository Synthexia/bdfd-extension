const vscode = require('vscode');

// Shorcuts
const lang = vscode.languages;
const kind = vscode.CompletionItemKind;

const range = undefined;

function snippets() {
	// $addButton[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addButton[${1|no,yes|};${2:Button ID/URL};${3:Label};${4|primary,success,danger,secondary,link|};${5|no,yes|};${6:Emoji};${7:Message ID}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addButton[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addButton';
			completion.detail = 'Adds button to the response.';
			completion.range = range;

			return [completion];
		}
	});
	// $sum[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$sum[${1:Numbers (separate with \";\")}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$sum[]\n```');
			completion.kind = kind.Function;
			completion.label = '$sum';
			completion.detail = 'Returns the sum of entered numbers.';
			completion.range = range;

			return [completion];
		}
	});
	// $onlyIf[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$onlyIf[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y};${4:Error message}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$onlyIf[]\n```');
			completion.kind = kind.Function;
			completion.label = '$onlyIf';
			completion.detail = 'Command can be used only if values are equal (==) or not equal (!=) or one of them is bigger (> or <) or one of them is equal or bigger (>= or <=).';
			completion.range = range;

			return [completion];
		}
	});
	// $addCmdReactions[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addCmdReactions[${1:Emojis (separate with \";\")}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addCmdReactions[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addCmdReactions';
			completion.detail = 'Allows you to auto-react to your message.';
			completion.range = range;

			return [completion];
		}
	});
	// $addEmoji[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addEmoji[${1:Name};${2:Url};${3|no,yes|}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addCmdReactions[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addEmoji';
			completion.detail = "Adds emoji to the server and if <return> is set to 'yes' the newly added emoji is returned.";
			completion.range = range;

			return [completion];
		}
	});
	// $if[] ... $endif
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$endif');
			completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $endif\n```');
			completion.kind = kind.Keyword;
			completion.label = '$if';
			completion.detail = 'If Statement block';
			completion.range = range;

			return [completion];
		}
	});
	// $if[] ... $else ... $endif
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$else\n    ${5:Code (FALSE)}\n\\$endif');
			completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $else ... $endif\n```');
			completion.kind = kind.Keyword;
			completion.label = '$ife';
			completion.detail = 'If Statement block with $else';
			completion.range = range;

			return [completion];
		}
	});
	// $if[] ... $elseif[] ... $elseif[] ... $endif
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$if[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y}]\n    ${4:Code (TRUE)}\n\\$elseif[${5:X}${6|==,!=,>=,>,<,<=|}${7:Y}]\n    ${8:Code (ELSEIF)}\n\\$elseif[${9:X}${10|==,!=,>=,>,<,<=|}${11:Y}]\n    ${12:Code (ELSEIF)}\n\\$endif');
			completion.documentation = new vscode.MarkdownString('```bds\n$if[] ... $elseif[] ... $elseif[] ... $endif\n```');
			completion.kind = kind.Keyword;
			completion.label = '$ifelif';
			completion.detail = 'If Statement block with $elseif';
			completion.range = range;

			return [completion];
		}
	});
	// $try ... $endtry
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$try\n    ${1:CODE}\n\\$endtry');
			completion.documentation = new vscode.MarkdownString('```bds\n$try ... $endtry\n```');
			completion.kind = kind.Keyword;
			completion.label = '$try';
			completion.detail = 'Try Block';
			completion.range = range;

			return [completion];
		}
	});
	// $try ... $catch ... $endtry
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$try\n    ${1:CODE (TRY)}\n\\$catch\n    ${2:CODE (CATCH)}\n\\$endtry');
			completion.documentation = new vscode.MarkdownString('```bds\n$try ... $catch ... $endtry\n```');
			completion.kind = kind.Keyword;
			completion.label = '$tryc';
			completion.detail = 'Try Block with $catch';
			completion.range = range;

			return [completion];
		}
	});
	// $async[] ... $endasync
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$async[${1:Block name}]\n    ${2:CODE}\n\\$endasync');
			completion.documentation = new vscode.MarkdownString('```bds\n$async[] ... $endasync\n```');
			completion.kind = kind.Keyword;
			completion.label = '$async';
			completion.detail = 'Async Block';
			completion.range = range;

			return [completion];
		}
	});
	// $async[] ... $endasync $await
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$async[${1:Block name}]\n    ${2:CODE}\n\\$endasync\n\\$await[${1:Block name}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$async[] ... $endasync ... $await[]\n```');
			completion.kind = kind.Keyword;
			completion.label = '$asynca';
			completion.detail = 'Async Block with $await';
			completion.range = range;

			return [completion];
		}
	});
	// Escapes
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('${1|%{DOL}%,%{-SEMICOL-}%,%ESCAPED%,\\\\\\\\,\\\\],\\\\;|}');
			completion.documentation = new vscode.MarkdownString('```bds\n%{DOL}% | %{-SEMICOL-}% | %ESCAPED% | \\\\\\\\ | \\\\] | \\\\;\n```');
			completion.kind = kind.Keyword;
			completion.label = '$esc';
			completion.detail = 'Insert escaped special character';
			completion.range = range;

			return [completion];
		}
	});
	// $addField[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addField[${1:Name};${2:Value};${3|no,yes|};${4|1,2,3,4,5,6,7,8,9,10|}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addField[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addField';
			completion.detail = "Adds field to embed. The third arguments sets if the field may be inline.";
			completion.range = range;

			return [completion];
		}
	});
	// $addReactions[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addReactions[${1:Emojis (separate with \";\")}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addReactions[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addReactions';
			completion.detail = "Allows you to autoreact to the bot's response.";
			completion.range = range;

			return [completion];
		}
	});
	// $addSelectMenuOption[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addSelectMenuOption[${1:Menu option ID};${2:Label};${3:Value};${4:Description};${5|no,yes|};${6:Emoji};${7:Message ID}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addSelectMenuOption[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addSelectMenuOption';
			completion.detail = "Adds select menu option to a select menu.";
			completion.range = range;

			return [completion];
		}
	});
	// $color[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$color[${1:Color};${2|1,2,3,4,5,6,7,8,9,10|}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$color[]\n```');
			completion.kind = kind.Color;
			completion.label = '$color';
			completion.detail = "Adds color to embed.";
			completion.range = range;

			return [completion];
		}
	});
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$color[\\$random[0;16777216]];${1|1,2,3,4,5,6,7,8,9,10|}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$color[$random[]]\n```');
			completion.kind = kind.Color;
			completion.label = '$colorand';
			completion.detail = "Adds random color to embed.";
			completion.range = range;

			return [completion];
		}
	});
	// $addTextInput[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addTextInput[${1:Text Input ID};${2|short,paragraph|};${3:Label};${4:Minimum length};${5:Maximum length};${6|no,yes|};${7:Value};${8:Placeholder}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addTextInput[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addTextInput';
			completion.detail = "Adds a new text input to a modal.";
			completion.range = range;

			return [completion];
		}
	});
	// $addTimestamp[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$addTimestamp[${1|1,2,3,4,5,6,7,8,9,10|}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$addTimestamp[]\n```');
			completion.kind = kind.Function;
			completion.label = '$addTimestamp';
			completion.detail = "Adds timestamp to the embed.";
			completion.range = range;

			return [completion];
		}
	});
	// $allMembersCount
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$allMembersCount');
			completion.documentation = new vscode.MarkdownString('```bds\n$allMembersCount\n```');
			completion.kind = kind.Function;
			completion.label = '$allMembersCount';
			completion.detail = "Returns number of users from every server that your bot is in.";
			completion.range = range;

			return [completion];
		}
	});
	// $allowMention
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$allowMention');
			completion.documentation = new vscode.MarkdownString('```bds\n$allowMention\n```');
			completion.kind = kind.Function;
			completion.label = '$allowMention';
			completion.detail = "Disables replacing mentions in $message to text.";
			completion.range = range;

			return [completion];
		}
	});
	// $allowRoleMentions[]
	lang.registerCompletionItemProvider('bds', {
		provideCompletionItems() {
			const completion = new vscode.CompletionItem();
			completion.insertText = new vscode.SnippetString('\\$allowRoleMentions[${1:Role IDs (separate with \";\")}]');
			completion.documentation = new vscode.MarkdownString('```bds\n$allowRoleMentions[]\n```');
			completion.kind = kind.Function;
			completion.label = '$allowRoleMentions';
			completion.detail = "Configures what role mentions should be pinged by the bot's reply. Can be left empty to disable pings.";
			completion.range = range;

			return [completion];
		}
	});
}

module.exports = snippets;