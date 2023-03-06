import parser from 'html-to-json-parser';
import fetch from 'node-fetch';

export default async function fetchCommandList(botID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}#commands`, {
        method: 'GET',
        headers: {'cookie':authToken}
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    if (objects.content == undefined) return undefined;

    let commandName: string,
    commandTrigger: string,
    commandID: number,
    array: any[] = [];

    const commandListPage = objects.content[3].content[3].content[7].content[3].content;
    commandListPage.forEach((commandListPage: any) => {
        if (commandListPage.content && commandListPage.content[1].content[1] != undefined) {
            if (commandListPage.content[1].content[1].content == undefined) {
                commandName = '[No name]';
            } else {
                commandName = commandListPage.content[1].content[1].content[0];
            };
            if (commandListPage.content[1].content[3].content == undefined) {
                commandTrigger = '[No trigger]';
            } else {
                commandTrigger = commandListPage.content[1].content[3].content[0];
            };
            commandID = commandListPage.content[5].content[1].attributes.href.trim().split('/')[5];
            array.push({
                label: commandName,
                detail: commandTrigger,
                _id: commandID
            });
        };
    });
    
    return array;
}
