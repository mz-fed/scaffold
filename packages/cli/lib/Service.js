"use strict";
/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 15:56 Monday
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const assert_1 = __importDefault(require("assert"));
const package_json_1 = __importDefault(require("../package.json"));
const PluginApi_1 = __importDefault(require("./PluginApi"));
class Service {
    constructor() {
        this.cac = cac_1.cac('mz-vite');
        this.initialized = false;
        this.plugins = [];
        this.commands = {};
        this.resolvePlugins();
    }
    resolvePlugins() {
        this.plugins = [
            './plugins/serve',
            './plugins/build',
            './plugins/init',
            './plugins/routes',
        ].map((item) => {
            const plugin = require(item);
            return { id: item, apply: plugin.default || plugin };
        });
    }
    init() {
        if (this.initialized)
            return;
        this.initialized = true;
        // global options
        this.cac.option('--debug [feat]', `[string | boolean]  show debug logs`);
        this.cac.usage('mz-vite [command] [args] [--options]');
        this.plugins.forEach(({ id, apply }) => {
            apply(new PluginApi_1.default(id, this), {});
        });
    }
    run() {
        const { cac } = this;
        this.init();
        cac.help();
        cac.version(package_json_1.default.version);
        cac.parse();
    }
    registerCommand(name, opts, fn) {
        if (typeof opts === 'function') {
            fn = opts;
            opts = null;
        }
        assert_1.default(!(name in this.commands), `Command ${name} exists, please select another one.`);
        this.commands[name] = true;
        const { description, options = {}, alias = '' } = opts;
        const cmd = this.cac.command(name, description);
        alias && cmd.alias(alias);
        Object.keys(options).forEach((key) => {
            cmd.option(key, options[key].description || '', options[key].option);
        });
        cmd.action(fn);
    }
}
exports.default = Service;
//# sourceMappingURL=Service.js.map