export type BotListQuickPick = Promise<BLQuickPick[]>;
export type CommandListQuickPick = Promise<CVLQuickPick[]>;
export type VariableListQuickPick = Promise<CVLQuickPick[]>;

/**
 * Bot List Quick Pick
 */
export interface BLQuickPick extends CVLQuickPick {
    _commands: string,
    _variables: string
}

/**
 * Command-Variable List Quick Pick
 */
export interface CVLQuickPick {
    label: string;
    detail: string;
    _id: string;
    _error: string;
}