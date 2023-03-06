import parser from 'html-to-json-parser';
import fetch from 'node-fetch';
import { writeUserData } from './localData';

export default async function fetchBotList(authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/home`, {
        method: 'GET',
        headers: {'cookie':authToken}
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    if (objects.content == undefined) return undefined;

    const array = objects.content[3].content[3].content;
    let botName: string,
    botID: string,
    // TODO botHosting: string,
    botCommands: any,
    botVariables: any,
    list_1: any[] = [],
    list_2: any[] = [];

    array.forEach(async (array: any) => {
        if (array.type == 'a') {
            if (array.content[1] != undefined) {
                botName = array.content[1].content[0];
                botID = array.attributes.href.trim().split('/')[1];

                if (array.content[3].content[1].attributes != undefined) {
                    // TODO botHosting = array.content[3].content[1].attributes["uk-countdown"];
                    // TODO botHosting = botHosting.split('date:')[1].trim();

                    // TODO const hostingDate = new Date(botHosting).toLocaleDateString();
                    // TODO const hostingTime = new Date(botHosting).toLocaleTimeString()

                    // TODO botHosting = `Until ${hostingDate} (${hostingTime})`;

                    botCommands = array.content[3].content[4];
                    botCommands = botCommands.split('commands')[0].trim();

                    botVariables = array.content[3].content[6];
                    botVariables = botVariables.split('variables')[0].trim();
                } else {
                    // TODO botHosting = array.content[3].content[0];
                    // TODO botHosting = botHosting.trim();
                    
                    botCommands = array.content[3].content[2];
                    botCommands = botCommands.split('commands')[0].trim();
                    
                    botVariables = array.content[3].content[4];
                    botVariables = botVariables.split('variables')[0].trim();
                };

                list_1.push({
                    botID: botID,
                    botName: botName,
                    commands: botCommands,
                    variables: botVariables
                });
                
                list_2.push({
                    label: botName,
                    detail: `${botCommands} command(s) and ${botVariables} variable(s)`,
                    _commands: botCommands,
                    _variables: botVariables,
                    _id: botID
                });

                (await writeUserData()).overwriteBotList(list_1);
            };
        };
    });
    
    return list_2;
}
