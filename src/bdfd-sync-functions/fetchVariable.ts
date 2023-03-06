import parser from 'html-to-json-parser';
import fetch from 'node-fetch';

export default async function fetchVariable(botID: number, variableID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/variable/${variableID}`, {
        method: 'GET',
        headers: {'cookie': authToken}
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    let variableName: string = '';

    if (objects.content[3].content[3].content[5].content[1].content[3].attributes.value == '') {
        variableName = '[No name]';
    } else {
        variableName = objects.content[3].content[3].content[5].content[1].content[3].attributes.value;
    };

    const variableValue: string = objects.content[3].content[3].content[5].content[3].content[3].attributes.value;
    
    return {variableName, variableValue};
}
