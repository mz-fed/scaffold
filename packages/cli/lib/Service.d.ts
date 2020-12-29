import { Command, CommandOptions, Noop, Plugin } from './type';
export default class Service {
    cac: import("cac").CAC;
    initialized: boolean;
    plugins: Plugin[];
    commands: Command;
    constructor();
    resolvePlugins(): void;
    init(): void;
    run(): void;
    registerCommand(name: string, opts: CommandOptions | Noop | null, fn: (...args: any[]) => any): void;
}
