import fetch from "node-fetch";

export default function deleteVariable(botID: number, variables: any[], authToken: string) {
    variables.forEach(async (variable) => {
        await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/variable/${variable._id}`, {
            method: 'DELETE',
            headers: { 'cookie': authToken }
        });
    });
}