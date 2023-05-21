import type {
    BLQuickPick,
    BotListQuickPick,
    CVLQuickPick,
    CommandListQuickPick,
    VariableListQuickPick
} from "../types/syncFeature/index";
import {
    type BaseData,
    Bot,
    type BotsResponse,
    Command,
    type CommandData,
    type CommandsResponse,
    type CreateCommand,
    type CreateVariable,
    type DeleteCommand,
    type DeleteVariable,
    type GetCommand,
    type GetVariable,
    type RequestError,
    type UpdateCommand,
    type UpdateVariable,
    Variable,
    type VariableData,
    type VariablesResponse
} from "@nightnutsky/bdfd-external";
import {
    HOSTING
} from "./consts";
import l from "../locale";

export default class Sync {
    private baseData: BaseData;

    constructor(baseData: BaseData) {
        this.baseData = baseData;
    }

    public async botListQuickPick(): BotListQuickPick {
        const get = await Bot.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <BotsResponse[]> get;

        if (status) {
            return [ <BLQuickPick> {
                label: l.sync.general.error.openBotList,
                detail: `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(bot => <BLQuickPick> {
            label: bot.botName,
            detail: bot.hostingTime == HOSTING.ENDED ? bot.hostingTime : `${HOSTING.ENDS} ${new Date(bot.hostingTime).toLocaleString()}`,
            _commands: bot.commandCount,
            _variables: bot.variableCount,
            _id: bot.botID
        });
    }

    public async commandListQuickPick(): CommandListQuickPick {
        const get = await Command.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <CommandsResponse[]> get;
        
        if (status) {
            return [ <CVLQuickPick> {
                label: l.sync.general.error.openCommandList,
                detail:  `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(command => <CVLQuickPick> {
            label: command.commandName,
            detail: command.commandTrigger,
            _id: command.commandID
        });
    }

    public async variableListQuickPick(): VariableListQuickPick {
        const get = await Variable.list(this.baseData);

        const { status, message } = <RequestError> get;
        const list = <VariablesResponse[]> get;
        
        if (status) {
            return [ <CVLQuickPick> {
                label: l.sync.general.error.openVariableList,
                detail: `${message} - ${l.sync.general.error.selectToCopy}`,
                _error: message
            }];
        }

        return list.map(variable => <CVLQuickPick> {
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
