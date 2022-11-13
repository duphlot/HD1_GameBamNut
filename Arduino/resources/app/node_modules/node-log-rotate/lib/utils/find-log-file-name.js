"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_log_path_1 = require("./find-log-path");
function default_1(appName = '', date) {
    return [find_log_path_1.default(appName), date, '_', 'log.log'].join('');
}
exports.default = default_1;
