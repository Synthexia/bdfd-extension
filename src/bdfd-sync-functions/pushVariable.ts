import fetch from "node-fetch";

export default async function pushVariable(botID: number, variableID: string, variableName: string, variableValue: string, authToken: string) {
    const req = await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/variable/${variableID}`, {
        method: 'POST',
        headers: {
            'cookie':authToken,
            'content-type':'application/x-www-form-urlencoded'
        },
        body: `name=${variableName}&value=${variableValue}`,
    });

    return req.status;
}
