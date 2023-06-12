import type {
    BotsResponse,
    BaseData,
    CommandData,
    CommandsResponse,
    CreateCommand,
    CreateVariable,
    DeleteCommand,
    DeleteVariable,
    GetCommand,
    GetVariable,
    RequestError,
    UpdateCommand,
    UpdateVariable,
    VariableData,
    VariablesResponse
} from "@nightnutsky/bdfd-external";
import {
    Bot,
    Command,
    Variable
} from "@nightnutsky/bdfd-external";
import {
    HOSTING
} from "./consts";
import l from "../locale";
import { Sync } from "../types";

export default class SyncFeature {
    private baseData: BaseData;

    constructor(baseData: BaseData) {
        this.baseData = baseData;
    }

    public async botListQuickPick(): Sync.Function.BotList {
        const get = await Bot.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <BotsResponse[]> get;

        if (status) {
            return [ <Sync.QuickPick.BotList> {
                label: l.sync.general.error.openBotList,
                detail: `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(bot => <Sync.QuickPick.BotList> {
            label: bot.botName,
            detail: bot.hostingTime == HOSTING.ENDED ? bot.hostingTime : `${HOSTING.ENDS} ${new Date(bot.hostingTime).toLocaleString()}`,
            _commands: bot.commandCount,
            _variables: bot.variableCount,
            _id: bot.botID
        });
    }

    public async commandListQuickPick(): Sync.Function.CommandList {
        const get = await Command.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <CommandsResponse[]> get;
        
        if (status) {
            return [ <Sync.QuickPick.CVL> {
                label: l.sync.general.error.openCommandList,
                detail:  `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(command => <Sync.QuickPick.CVL> {
            label: command.commandName,
            detail: command.commandTrigger,
            _id: command.commandID
        });
    }

    public async variableListQuickPick(): Sync.Function.VariableList {
        const get = await Variable.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <VariablesResponse[]> get;
        
        if (status) {
            return [ <Sync.QuickPick.CVL> {
                label: l.sync.general.error.openVariableList,
                detail: `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(variable => <Sync.QuickPick.CVL> {
            label: variable.variableName,
            detail: variable.variableValue,
            _id: variable.variableID
        });
    }

    public async getCommand(commandID: string): GetCommand {
        return await Command.get(this.baseData, commandID);
    }

    public async getVariable(variableID: string): GetVariable {
        return await Variable.get(this.baseData, variableID);
    }

    public async updateCommand(commandData: CommandData): UpdateCommand {
        return await Command.update(this.baseData, commandData);
    }

    public async updateVariable(variableData: VariableData): UpdateVariable {
        return await Variable.update(this.baseData, variableData);
    }

    public async createCommand(commandData: Omit<CommandData, 'commandID'>): CreateCommand {
        return await Command.create(this.baseData, commandData);
    }

    public async createVariable(variableData: Omit<VariableData, 'variableID'>): CreateVariable {
        return await Variable.create(this.baseData, variableData);
    }

    public async deleteCommand(commandID: string): DeleteCommand {
        return await Command.delete(this.baseData, commandID);
    }

    public async deleteVariable(variableID: string): DeleteVariable {
        return await Variable.delete(this.baseData, variableID);
    }
}
