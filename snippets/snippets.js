const vscode = require('vscode');
const d = require('./data');

// Shorcut
const lang = vscode.languages;

function snippets() {
	d.forEach(d => {
		lang.registerCompletionItemProvider('bds', {
			provideCompletionItems() {
				const completion = new vscode.CompletionItem();
				completion.label = d.label;
				completion.insertText = d.snippet;
				completion.documentation = d.doc;
				completion.detail = d.det;
				completion.kind = d.kind;

				return [completion];
			}
		});
	});
}

module.exports = snippets;
