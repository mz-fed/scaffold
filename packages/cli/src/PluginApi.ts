/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 17:09 Monday
*/

import assert from "assert";
import Service from './Service';

import { CommandOptions, Noop } from './type';

export default class PluginApi {
  id: string;
  service: Service;
  constructor(id: string, service: Service) {
    this.id = id;
    this.service = service;
  }

  registerCommand(name: string, opts: CommandOptions, fn: Noop) {
    const {service} = this

    if (typeof opts === "function") {
      fn = opts;
      opts = null;
    }
    assert(
      !(name in service.commands),
      `api.registerCommand() failed, the command ${name} is exists..`
    );
    service.commands[name] = true;
    const { description, options = {}, alias = "" } = opts as CommandOptions;
    const cmd = service.cac.command(name, description);
    alias && cmd.alias(alias);
    Object.keys(options).forEach(key => {
      cmd.option(key, options[key].description || "", options[key].option);
    });

    cmd.action(fn);
  }

  registerMethod(name: string, fn: Function) {
    const {service} = this
    assert(
      !(name in service.pluginMethods),
      `api.registerMethod() failed, the method ${name} is exists..`
    );
    service.pluginMethods[name] = fn
  }
}
