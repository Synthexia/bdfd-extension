import parser from 'html-to-json-parser';
import fetch from "node-fetch";

export default async function fetchVariableList(botID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}#variables`, {
        method: 'GET',
        headers: {'cookie': authToken}
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    if (objects.content == undefined) return undefined;

    let name: string = '',
    array: any[] = [];

    const variableListPage = objects.content[3].content[3].content[7].content[5].content
    variableListPage.forEach((variableListPage: any) => {
        if (variableListPage.type == 'div') {
            if (variableListPage.content != undefined) {
                const value: string = variableListPage.content[1].content[3].content[0].split('value=')[1],
                    id: number = variableListPage.content[5].content[1].attributes.href.split('/')[5];

                if (variableListPage.content[1].content[1].content == undefined) {
                    name = '[No name]';
                } else {
                    name = variableListPage.content[1].content[1].content[0];
                };

                array.push({
                    label: name,
                    detail: value,
                    _id: id
                });
            };
        };
    });

    return array;
}
