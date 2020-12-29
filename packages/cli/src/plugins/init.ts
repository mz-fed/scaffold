/*
  init.ts
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 16:17 Monday
*/

import PluginApi from '../PluginApi';

export default function (api: PluginApi, options: any) {
  api.registerCommand(
    'init <project-name>',
    {
      description: '创建一个 mz-vite 项目',
    },
    async (args: any) => {
      console.log(args);
    },
  );
}
