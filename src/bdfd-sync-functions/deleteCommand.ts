import fetch from "node-fetch";

export default function deleteCommand(botID: number, commands: any[], authToken: string) {
    commands.forEach(async (command) => {
        await fetch(`https://botdesignerdiscord.com/app/bot/${botID}/command/${command._id}`, {
            method: 'DELETE',
            headers: { 'cookie': authToken }
        });
    });
}