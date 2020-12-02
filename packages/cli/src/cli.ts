// const start = Date.now();
const argv = require('minimist')(process.argv.slice(2));
if (argv.debug) {
  process.env.DEBUG = `mz-vite:` + (argv.debug === true ? '*' : argv.debug);
}
import { cac } from 'cac';
import logger from './logger';
import initProject from './init';
import fs from 'fs-extra';
import path from 'path';

const execa = require('execa');
const cli = cac('mz-vite');
const vite = require.resolve('vite/bin/vite');
const pkg = require('../package.json');
const debug = require('debug')('mz-vite:cli');

logger.info(`${pkg.name} ${pkg.version}`);
const isMzViteProject = fs.existsSync(path.join(process.cwd(), '.mz'));
const checkIsMzViteProject = () => {
  if (!isMzViteProject) {
    logger.error('Error: 当前所在目录不是一个 mz-vite 项目！');
    process.exit(1);
  } else {
    debug(fs.readFileSync(path.join(process.cwd(), '.mz')));
  }
};

// global options
cli.option('--debug [feat]', `[string | boolean]  show debug logs`);

// default serve
cli
  .command('[serve]', '启动开发服务')
  .alias('serve')
  .action(async (_, argv: any) => {
    checkIsMzViteProject();
    await genRoutes();
    return await execa(vite, [], {
      stdio: 'inherit',
    });
  });

cli.command('build', '生产构建').action(async (_, argv: any) => {
  checkIsMzViteProject();
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

// 创建一个 vite 项目
async function runInit(name: string) {
  return await initProject(name);
}

// 更新 admin 脚手架
async function runUpdate() {
  return Promise.resolve(0);
}
