"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execa = require('execa');
const vite = require.resolve('vite/bin/vite');
function default_1(api, _) {
    api.registerCommand('build', {
        description: '生产构建',
    }, async (args) => {
        await execa(vite, ['build'], {
            stdio: 'inherit',
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=build.js.map