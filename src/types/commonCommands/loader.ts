export interface TextMateRules {
    name: string;
    scope: string;
    settings: TextMateRulesSettings;
}

interface TextMateRulesSettings {
    foreground: string;
    fontStyle: string;
}

export interface Options {
    foreground: string;
    fontStyle: string;
    scope: string;
    label?: string;
}

export interface TextMateRulesQuickPickItems {
    description: string;
    foreground: string;
    fontStyle: string;
    scope: string;
    label: string;
    name?: string;
}

export type UpdateType = 'foreground' | 'style';