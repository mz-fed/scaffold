/*
  logger.ts
  着色日志输出
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 16:27 星期四
*/
import chalk from 'chalk';
export default {
  log(txt?: string) {
    console.log(txt || '');
  },
  info(txt?: string) {
    console.log(chalk.cyan(txt || ''));
  },
  success(txt?: string) {
    console.log(chalk.green(txt || ''));
  },
  warn(txt: string) {
    console.log(chalk.yellow(txt));
  },
  error(txt: string, err?: any) {
    console.error(chalk.red(txt));
    err && console.error(err);
  },
};
