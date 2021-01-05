/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 15:56 Monday
*/

import { cac } from "cac";
import pkg from "../package.json";
import PluginApi from "./PluginApi";
import { Command, CommandOptions, Noop, Plugin } from "./type";

export default class Service {
  cac = cac("mz-vite");
  initialized = false;
  plugins: Plugin[] = [];
  pluginMethods: { [key: string]: Function } = {}
  commands: Command = {};
  context: string = "";
  constructor(context: string) {
    this.context = context;
    this.resolvePlugins();
  }
  resolvePlugins() {
    this.plugins = [
      "./plugins/serve",
      "./plugins/build",
      "./plugins/init",
      "./plugins/routes"
    ].map(item => {
      const plugin = require(item);
      return { id: item, apply: plugin.default || plugin };
    });
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    // global options
    this.cac.option("--debug [feat]", `[string | boolean]  show debug logs`);
    this.cac.usage("mz-vite [command] [args] [--options]");
    this.plugins.forEach(({ id, apply }) => {
      apply(new PluginApi(id, this), {});
    });
  }

  run() {
    const { cac } = this;
    this.init();
    cac.help();
    cac.version(pkg.version);
    cac.parse();
  }

  getPluginApi(id) {
    const api = new PluginApi(id, this)


    return new Proxy(api, {
      get: (target, prop: string) => {
        if (this.pluginMethods[prop]) return this.pluginMethods[prop];
        return target[prop];
      }
    })
  }

