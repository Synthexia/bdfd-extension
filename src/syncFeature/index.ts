import {
    Bot,
    Command,
    Variable,
    type Request,
    User
} from "@nightnutsky/bdfd-external";
import {
    HOSTING
} from "./consts";
import l from "../locale";
import { Sync } from "../types";

export default class SyncFeature {
    private baseData: Request.Data.Base;

    constructor(baseData: Request.Data.Base) {
        this.baseData = baseData;
    }

    public async user() {
        return await User.get(this.baseData).catch((e: Request.Error) => { throw e });
    }

    public async botListQuickPick(): Promise<Sync.QuickPick.BotList[]> {
        const list = await Bot.list(this.baseData).catch((e: Request.Error) => {
            throw [<Sync.QuickPick.BotList> {
                label: l.sync.general.error.openBotList,
                detail: `${e.message} - ${l.sync.general.error.selectToCopy}`,
                _error: e.message
            }];
        });

        return list.map((bot) => <Sync.QuickPick.BotList> {
            label: bot.botName,
            detail: bot.hostingTime == HOSTING.ENDED ? bot.hostingTime : `${HOSTING.ENDS} ${new Date(bot.hostingTime).toLocaleString()}`,
            _commands: bot.commandCount,
            _variables: bot.variableCount,
            _id: bot.botID
        });
    }

    public async commandListQuickPick(): Promise<Sync.QuickPick.CVL[]> {
        const list = await Command.list(this.baseData).catch((e: Request.Error) => {
            throw [ <Sync.QuickPick.CVL> {
                label: l.sync.general.error.openCommandList,
                detail:  `${e.message} - ${l.sync.general.error.selectToCopy}`,
                _error: e.message
            }];
        });

        return list.map((command) => <Sync.QuickPick.CVL> {
            label: command.commandName,
            detail: command.commandTrigger,
            _id: command.commandID
        });
    }

    public async variableListQuickPick(): Promise<Sync.QuickPick.CVL[]> {
        const list = await Variable.list(this.baseData).catch((e: Request.Error) => {
            throw [ <Sync.QuickPick.CVL> {
                label: l.sync.general.error.openVariableList,
                detail: `${e.message} - ${l.sync.general.error.selectToCopy}`,
                _error: e.message
            }];
        });

        return list.map((variable) => <Sync.QuickPick.CVL> {
            label: variable.variableName,
            detail: variable.variableValue,
            _id: variable.variableID
        });
    }

    public async getCommand(commandID: string) {
        return await Command.get(this.baseData, commandID).catch((e: Request.Error) => { throw e });
    }

    public async getVariable(variableID: string) {
        return await Variable.get(this.baseData, variableID).catch((e: Request.Error) => { throw e });
    }

    public async updateCommand(commandData: Partial<Omit<Request.Data.Command.Data, "commandID">>, commandID: string) {
        return await Command.update(this.baseData, commandData, commandID).catch((e: Request.Error) => { throw e });
    }

    public async updateVariable(variableData: Partial<Omit<Request.Data.Variable.Data, "variableID">>, variableID: string) {
        return await Variable.update(this.baseData, variableData, variableID).catch((e: Request.Error) => { throw e });
    }

    public async createCommand(commandData: Partial<Omit<Request.Data.Command.Data, "commandID">>) {
        return await Command.create(this.baseData, commandData).catch((e: Request.Error) => { throw e });
    }

    public async createVariable(variableData: Partial<Omit<Request.Data.Variable.Data, "variableID">>) {
        return await Variable.create(this.baseData, variableData).catch((e: Request.Error) => { throw e });
    }

    public async deleteCommand(commandID: string) {
        return await Command.delete(this.baseData, commandID).catch((e: Request.Error) => { throw e });
    }

    public async deleteVariable(variableID: string) {
        return await Variable.delete(this.baseData, variableID).catch((e: Request.Error) => { throw e });
    }
}
