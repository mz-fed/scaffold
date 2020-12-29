/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 17:09 Monday
*/

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
    this.service.registerCommand(name, opts, fn);
  }
}
