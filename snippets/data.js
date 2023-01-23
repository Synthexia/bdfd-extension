const vscode = require('vscode');

// Shortcuts
const s = vscode.SnippetString;
const m = vscode.MarkdownString;
const k = vscode.CompletionItemKind;

// Completion Items Data
const data = [
    {
        label: '$addButton[]',
        snippet: new s('\\$addButton[${1|no,yes|};${2:Button ID/URL};${3:Label};${4|primary,success,danger,secondary,link|};${5|no,yes|};${6:Emoji};${7:Message ID}]'),
        doc: new m('```bds\n$addButton[]\n```'),
        det: 'Adds button to the response.',
        kind: k.Function
    },
    {
        label: '$sum[]',
        snippet: new s('\\$sum[${1:Numbers (separate with \";\")}]'),
        doc: new m('```bds\n$sum[]\n```'),
        det: 'Returns the sum of entered numbers.',
        kind: k.Function
    },
    {
        label: '$onlyIf[]',
        snippet: new s('\\$onlyIf[${1:X}${2|==,!=,>=,>,<,<=|}${3:Y};${4:Error message}]'),
        doc: new m('```bds\n$onlyIf[]\n```'),
        det: 'Command can be used only if values are equal (==) or not equal (!=) or one of them is bigger (> or <) or one of them is equal or bigger (>= or <=).',
        kind: k.Function
    },
   {
        label: '$botLeave',
        snippet: new s('\\$botLeave'),
        doc: new m('```bds\n$botLeave\n```'),
        det: 'Bot is forced to leave the server.',
        kind: k.Function
    },
    {
        label: '$botLeave[]',
        snippet: new s('\\$botLeave[${1:Server ID}]'),
        doc: new m('```bds\n$botLeave[]\n```'),
        det: 'Bot is forced to leave the server.',
        kind: k.Function
    }
];

module.exports = data;
