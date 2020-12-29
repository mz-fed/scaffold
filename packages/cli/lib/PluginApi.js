"use strict";
/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 17:09 Monday
*/
Object.defineProperty(exports, "__esModule", { value: true });
class PluginApi {
    constructor(id, service) {
        this.id = id;
        this.service = service;
    }
    registerCommand(name, opts, fn) {
        this.service.registerCommand(name, opts, fn);
    }
}
exports.default = PluginApi;
//# sourceMappingURL=PluginApi.js.map