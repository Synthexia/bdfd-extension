import { ThemeIcon } from "vscode";

export const ICON = {
    BOT: new ThemeIcon('hubot'),
    FILE: new ThemeIcon('file'),
    DATABASE: new ThemeIcon('database'),
    SYNC: new ThemeIcon('sync')
} as const;
