import { Client, type SetActivity } from "@xhayper/discord-rpc";

import { richPresence as richPresenceLoc } from "@localization";

import { CLIENT_ID as clientId, ICON } from "@rpc/consts";

const rpc = new Client({ clientId });

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
    } satisfies SetActivity;

    constructor() {
        this.client = rpc;
    }

    
    /**
     * Initialize
     */
    public connect() {
        this.client.on('ready', async () => {
            if (!rpc.user) return;

            await rpc.user.setActivity({...this.baseActivity});
        });
        
        this.client.on('disconnected', async () => {
            await rpc.destroy();
        });
        
        this.makeConnection();

        return this;
    }

    private async setActivity(
        data: Omit<
            SetActivity,
            | 'largeImageKey'
            | 'largeImageText'
            | 'startTimestamp'
            | 'buttons'
        >
    ) {
        if (!this.client.user)
            return console.error('[BDFD Sync Feature - RPC] Failed to set activity because client user is undefined.');

        await this.client.user.setActivity({
            ...this.baseActivity,
            ...data
        });
    }

    private makeConnection() {
        this.client.connect()
            .then(async () => {
                await this.setActivity({
                    details: richPresenceLoc.loginDetails
                });
            })
            .catch((e: Error) => {
                if (e.message == 'RPC_CONNECTION_TIMEOUT') {
                    console.info('RPC Connection timed out... Reconnecting in 10 seconds');
                    
                    setTimeout(() => this.makeConnection(), 10e3);
                }
                else
                    console.error('[BDFD Sync Feature - RPC] Unhandled RPC Error:', e);
            });
    }

    public async updateActivity(data: PresenceData) {
        const { botName, commandName, commandTrigger } = data;
        
        await this.setActivity({
            details: richPresenceLoc.details(botName),
            state: `${commandName || richPresenceLoc.state.unnamedCommand} - ${commandTrigger || richPresenceLoc.state.nontriggerable}`
        });
    }

    public async clearActivity() {
        await this.setActivity({
            details: richPresenceLoc.loginDetails
        });
    }

    public async destroy() {
        await this.client.destroy();
    }

    public getClient() {
        return this.client;
    }
}
