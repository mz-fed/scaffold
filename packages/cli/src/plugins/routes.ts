/*
  routes.ts
  约定路由
  Created by M.Wang [cn_wang@139.com]
  2020-12-29 15:07 Tuesday
*/

import assert from 'assert';
import PluginApi from '../PluginApi';
import { RouteOpts } from '../type';
import { resolve, join, sep, parse, ParsedPath } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { outputFileSync } from 'fs-extra';

class Router {
  private opts: RouteOpts;
  private uid = 0;
  constructor(options: RouteOpts) {
    this.opts = options;
    assert(!existsSync(options.root));
  }
  scanDir() {}
}
export default function (api: PluginApi, options: any) {
  api.registerCommand(
    'routes',
    {
      description: '创建约定路由配置文件',
    },
    (args: any) => {},
  );
}
