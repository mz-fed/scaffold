// const start = Date.now();
const execa = require('execa');
import { cac } from 'cac';
import logger from './logger';
const cli = cac('admin');
const vite = require.resolve('vite/bin/vite');
const pkg = require('../package.json');
// default serve
logger.info(`${pkg.name} ${pkg.version}`);
cli
  .command('[serve]', '启动开发服务')
  .alias('serve')
  .action(async (_, argv: any) => {
    await genRoutes();

    return await execa(vite, [], {
      stdio: 'inherit',
    });
  });

cli.command('build', '生产构建').action(async (_, argv: any) => {
  await genRoutes();
  return await execa(vite, ['build'], {
    stdio: 'inherit',
  });
});

cli
  .command('init <project-name>', '创建一个 admin 项目')
  .action(async (name: string, _) => {
    return await runInit(name);
  });

cli.command('update', '更新 admin 脚手架').action(async () => {
  return await runUpdate();
});

cli.help();
cli.version(require('../package.json').version);
cli.parse();

// 生成约定路由
async function genRoutes() {
  return Promise.resolve(0);
}

// 创建一个 admin 项目
async function runInit(name: string) {
  return Promise.resolve(0);
}

// 更新 admin 脚手架
async function runUpdate() {
  return Promise.resolve(0);
}
