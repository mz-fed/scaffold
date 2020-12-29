import Service from './Service';
import { CommandOptions, Noop } from './type';
export default class PluginApi {
    id: string;
    service: Service;
    constructor(id: string, service: Service);
    registerCommand(name: string, opts: CommandOptions, fn: Noop): void;
}
