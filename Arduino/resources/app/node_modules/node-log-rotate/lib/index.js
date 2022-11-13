"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transport_file_1 = require("./transport-file");
const delete_log_files_1 = require("./delete-log-files");
const APP_NAME = 'node-log-rotate';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const LOG_APP_NAME = process.env.npm_package_name || APP_NAME;
let logAppName = LOG_APP_NAME;
let logMaxSize = 5 * 1024 * 1024;
function setup(options) {
    if (options.appName) {
        logAppName = options.appName;
    }
    if (options.maxSize) {
        logMaxSize = options.maxSize;
    }
}
exports.setup = setup;
function log(text) {
    return transport_file_1.default(text, logAppName, logMaxSize);
}
exports.log = log;
function deleteLog(howManyDaysAgo) {
    delete_log_files_1.default(howManyDaysAgo, logAppName);
}
exports.deleteLog = deleteLog;
