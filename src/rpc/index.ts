import { Client, type Presence } from "discord-rpc";

import { richPresence as richPresenceLoc } from "@localization";

import { CLIENT_ID, ICON, TRANSPORT } from "@rpc/consts";

const rpc = new Client({ transport: TRANSPORT });
const startTimestamp = new Date();

interface PresenceData {
    botName: string;
    commandName: string;
    commandTrigger: string;
}

export class RPC {
    private client: Client;
    private baseActivity = {
        largeImageKey: ICON,
        buttons: [{
            label: richPresenceLoc.label,
            url: 'https://github.com/Synthexia/bdfd-extension'
        }],
        startTimestamp
    } satisfies Presence;

    constructor() {
        this.client = rpc;
    }

    private async setActivity(
        data: Omit<
            Presence,
            | 'largeImageKey'
            | 'largeImageText'
            | 'startTimestamp'
            | 'buttons'
        >
    ) {
        await this.client.setActivity({
            ...this.baseActivity,
            ...data
        });
    }

    /**
     * Initialize
     */
    public login() {
        this.client.on('ready', async () => {
            await rpc.setActivity({...this.baseActivity});
        });
        
        this.client.on('disconnected', async () => {
            await rpc.destroy();
        });

        this.client.on('error', (e: Error) => {
            if (e.name == 'RPC_CONNECTION_TIMEOUT') {
                console.info('RPC Connection timed out... Reconnecting in 5 seconds');
                
                setTimeout(() => this.makeConnection(CLIENT_ID), 5000);
            }
            else
                console.error('Unhandled RPC Error:', e);
        });
        
        this.makeConnection(CLIENT_ID);

        return this;
    }

    private makeConnection(clientId: string) {
        this.client.login({ clientId })
            .then(async () => {
                await this.setActivity({
                    details: richPresenceLoc.loginDetails
                });
            });
    }

    public async updateActivity(data: PresenceData) {
        const { botName, commandName, commandTrigger } = data;

        await this.setActivity({
            details: richPresenceLoc.details(botName),
            state: `${commandName} - ${commandTrigger}`
        });
    }

    public async destroy() {
        await this.client.destroy();
    }

    public getClient() {
        return this.client;
    }
}
