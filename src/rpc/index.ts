import { Client, type Presence } from "discord-rpc";
import { CLIENT_ID, ICON, TRANSPORT } from "./consts";
import { richPresence } from "../localization";

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
            label: richPresence.label,
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
                console.info('RPC Connection timed out... Reconnecting');
                this.client.login({ clientId: CLIENT_ID });
            }
        });
        
        this.client.login({ clientId: CLIENT_ID })
            .then(async () => {
                await this.setActivity({
                    details: 'Just starting a session...'
                });
            });

        return this;
    }

    public async updateActivity(data: PresenceData) {
        const { botName, commandName, commandTrigger } = data;

        await this.setActivity({
            details: richPresence.details(botName),
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
