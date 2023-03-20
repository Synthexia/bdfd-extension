export interface TextMateRules {
    name: string,
    scope: string,
    settings: TextMateRulesSettings
}

interface TextMateRulesSettings {
    foreground: string,
    fontStyle: string
}

export interface TextMateRulesQuickPick {
    description: string,
    foreground: string,
    fontStyle: string,
    scope: string,
    label: string,
    name?: string
}
