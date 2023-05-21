export const ARGUMENT = Object.freeze({
    NEW_ROW: 'New row',
    STYLE: 'Style',
    DISABLED: '(Disabled',
    REQUIRED: 'Required',
    INDEX: {
        A: '(Index)',
        B: 'Embed index'
    },
    TYPE: {
        A: 'Type',
        B: '(Type)'
    },
    CONDITION: 'Condition'
});

export const TABSTOP_PART = Object.freeze({
    NO_YES: '|no,yes|',
    BUTTON_STYLE: '|primary,secondary,danger,success,link|',
    PARAGRAPH_STYLE: '|short,paragraph|',
    INDEX: '|1,2,3,4,5,6,7,8,9,10|',
    CHANNEL_TYPE: '|category,stage,forum,text,voice|',
    ERROR_TYPE: '|command,source,message,row,column|',
    EMBED_TYPE: '|timestamp,title,description,footer,color,image|',
    MESSAGE_TYPE: '|content,authorID,username,avatar|',
    VARIABLE_TYPE: '|user,server,globaluser,channel|',
    CONDITION: '|>,<,==,!=,>=,<=|'
});

export const EXCEPTION_TAG = Object.freeze({
    ADD_BUTTON: '$addButton[]',
    EDIT_BUTTON: '$editButton[]',
    CREATE_CHANNEL: '$createChannel[]',
    ERROR: '$error[]',
    GET_EMBED_DATA: '$getEmbedData[]',
    GET_MESSAGE: '$getMessage[]',
    VARIABLES_COUNT: '$variablesCount[]'
});

export const PARENTHESIS_REGEX = /[\(\)]/gm;