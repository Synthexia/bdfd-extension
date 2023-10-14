export const EXTENSION_ID = 'synthexia.bdfd-extension';
export const TREE_DATA_PROVIDER = 'bdfd-container';

export const EMPTY = '';
export const SEMI_EMPTY = ' ';
export const EMPTY_ARRAY = [];

export const LANG = 'bds';

export const SPECIAL_CHARACTER = {
    BACK_SLASH: {
        NORMAL: '\\',
        ESCAPED: '\\\\'
    },
    LEFT_BRACKET: {
        NORMAL: '['
    },
    RIGHT_BRACKET: {
        NORMAL: ']',
        ESCAPED: '\\]'
    },
    DOLLAR: {
        NORMAL: '$',
        ESCAPED: '%{DOL}%',
        ESCAPED2: '\$'
    },
    SEMICOLON: {
        NORMAL: ';',
        ESCAPED: '\\;'
    },
    LEFT_BRACE: {
        NORMAL: '{'
    },
    RIGHT_BRACE: {
        NORMAL: '}'
    }
} as const;
