"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  logger.ts
  着色日志输出
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 16:27 星期四
*/
const chalk_1 = __importDefault(require("chalk"));
exports.default = {
    log(txt) {
        console.log(txt || '');
    },
    info(txt) {
        console.log(chalk_1.default.cyan(txt || ''));
    },
    success(txt) {
        console.log(chalk_1.default.green(txt || ''));
    },
    warn(txt) {
        console.log(chalk_1.default.yellow(txt));
    },
    error(txt, err) {
        console.error(chalk_1.default.red(txt));
        err && console.error(err);
    },
};
//# sourceMappingURL=logger.js.map