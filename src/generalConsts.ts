export const
    EMPTY = '',
    SEMI_EMPTY = ' ',
    EMPTY_ARRAY = []
;

export const EXTENSION_ID = 'synthexia.bdfd-extension';

export const LANG = 'bds';

export const SPECIAL_CHARACTER = Object.freeze({
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
});
