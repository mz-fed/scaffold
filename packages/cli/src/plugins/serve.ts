import PluginApi from '../PluginApi';
const execa = require('execa');
const vite = require.resolve('vite/bin/vite');

export default function (api: PluginApi, options: any) {
  api.registerCommand(
    '[serve]',
    {
      description: '启动开发服务',
      alias: 'serve',
    },
    async (args: any) => {
      await execa(vite, [], {
        stdio: 'inherit',
      });
    },
  );
}
