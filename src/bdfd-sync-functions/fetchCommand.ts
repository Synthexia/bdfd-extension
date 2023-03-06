import parser from 'html-to-json-parser';
import fetch from 'node-fetch';

export default async function fetchCommand(botID: number, commandID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/command/${commandID}`, {
        method: 'GET',
        headers: {'cookie': authToken}
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    let commandName: string,
    commandTrigger: string,
    commandLanguage: string = '',
    commandLanguageID: number = 0,
    commandCode: string;
    const languageData = objects.content[3].content[3].content[5].content[7].content[3].content;
    languageData.forEach((languageData: any) => {
            if (languageData.attributes && languageData.attributes.selected != undefined) {
                commandLanguage = languageData.content[0];
                commandLanguageID = languageData.attributes.value;
            };
    });
    if (objects.content[3].content[3].content[5].content[5].content[3].content == undefined) {
        commandCode = '[No code]';
    } else {
        commandCode = commandCode = objects.content[3].content[3].content[5].content[5].content[3].content[0];
    };
    if (objects.content[3].content[3].content[5].content[1].content[3].attributes.value == '') {
        commandName = '[No name]';
    } else {
        commandName = objects.content[3].content[3].content[5].content[1].content[3].attributes.value;
    };
    if (objects.content[3].content[3].content[5].content[3].content[3].attributes.value == '') {
        commandTrigger = '[No trigger]';
    } else {
        commandTrigger = objects.content[3].content[3].content[5].content[3].content[3].attributes.value;
    };

   return {commandName, commandTrigger, commandLanguage, commandLanguageID, commandCode};
}
