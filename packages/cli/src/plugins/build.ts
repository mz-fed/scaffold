import PluginApi from '../PluginApi';
const execa = require('execa');
const vite = require.resolve('vite/bin/vite');
export default function (api: PluginApi, _: any) {
  api.registerCommand(
    'build',
    {
      description: '生产构建',
    },
    async (args: any) => {
      await execa(vite, ['build'], {
        stdio: 'inherit',
      });
    },
  );
}
