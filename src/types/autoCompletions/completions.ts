import type {
    SnippetString,
    MarkdownString,
    CompletionItemKind
} from "vscode";

export interface FunctionList {
    tag: string;
    shortDescription: string;
    longDescription: string;
    arguments: FunctionArguments[];
    intents: number;
    premium: boolean;
    color: number;
}

export interface CompletionItemData {
    label: string;
    snippet: string | SnippetString;
    doc: string | MarkdownString;
    det: string;
    kind: CompletionItemKind;
}

interface FunctionArguments {
    name: string;
    description?: string;
    type: string;
    enumData?: string[];
    required: boolean;
    empty?: boolean;
}