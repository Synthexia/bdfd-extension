import fetch from "node-fetch";

export default async function createCommand(botID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/new_command`, {
        method: 'GET',
        headers: { 'cookie': authToken },
        redirect: 'manual'
    });

    if (req.status == 302) return undefined;
    
    const ID = req.headers.get('location')?.split('/')[7];

    return {
        newCommandID: ID
    };
};
