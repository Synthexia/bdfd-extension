import fetch from "node-fetch";

export default async function createVariable(botID: number, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/new_variable`, {
        method: 'GET',
        headers: { 'cookie': authToken },
        redirect: 'manual'
    });

    if (req.status == 302) return undefined;
    
    const ID = req.headers.get('location')?.split('/')[7];

    return {
        newVariableID: ID
    };
};
