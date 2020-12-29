"use strict";
/*
  routes.ts
  约定路由
  Created by M.Wang [cn_wang@139.com]
  2020-12-29 15:07 Tuesday
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fs_1 = require("fs");
class Router {
    constructor(options) {
        this.uid = 0;
        this.opts = options;
        assert_1.default(!fs_1.existsSync(options.root));
    }
    scanDir() { }
}
function default_1(api, options) {
    api.registerCommand('routes', {
        description: '创建约定路由配置文件',
    }, (args) => { });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map