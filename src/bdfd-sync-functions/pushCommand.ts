import parser from 'html-to-json-parser';
import fetch from "node-fetch";

export default async function pushCommand(botID: number, commandID: string, commandName: string, commandTrigger: string, commandLanguageID: number, commandCode: string, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/command/${commandID}`, {
        method: 'POST',
        headers: {
            'cookie':authToken,
            'content-type':'application/x-www-form-urlencoded'
        },
        body: `name=${commandName}&command=${commandTrigger}&replyMessage=${commandCode}&language=${commandLanguageID}`,
    }),
    text = await req.text(),
    objects: any = await parser(text, false);

    if (objects.content == undefined) return false;

    return true
}
