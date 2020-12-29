/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 15:56 Monday
*/

import { cac } from 'cac';
import assert from 'assert';
import pkg from '../package.json';
import PluginApi from './PluginApi';
import { Command, CommandOptions, Noop, Plugin } from './type';

export default class Service {
  cac = cac('mz-vite');
  initialized = false;
  plugins: Plugin[] = [];
  commands: Command = {};
  constructor() {
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
    if (this.initialized) return;
    this.initialized = true;
    // global options
    this.cac.option('--debug [feat]', `[string | boolean]  show debug logs`);
    this.cac.usage('mz-vite [command] [args] [--options]');
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

  registerCommand(
    name: string,
    opts: CommandOptions | Noop | null,
    fn: (...args: any[]) => any,
  ) {
    if (typeof opts === 'function') {
      fn = opts;
      opts = null;
    }
    assert(
      !(name in this.commands),
      `Command ${name} exists, please select another one.`,
    );
    this.commands[name] = true;
    const { description, options = {}, alias = '' } = opts as CommandOptions;
    const cmd = this.cac.command(name, description);
    alias && cmd.alias(alias);
    Object.keys(options).forEach((key) => {
      cmd.option(key, options[key].description || '', options[key].option);
    });

    cmd.action(fn);
  }
}
