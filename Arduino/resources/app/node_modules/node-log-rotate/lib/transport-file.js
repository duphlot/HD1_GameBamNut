"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const fs = require("fs");
const get_now_date_1 = require("./utils/get-now-date");
const get_now_time_1 = require("./utils/get-now-time");
const find_log_file_name_1 = require("./utils/find-log-file-name");
let file;
let stream;
let date;
function default_1(msg, appName, maxSize) {
    const text = msg;
    date = dateDetermination(date);
    if (!stream) {
        file = file || find_log_file_name_1.default(appName, date);
        if (!file) {
            // error
            return false;
        }
        if (maxSize > 0) {
            logRotate(file, maxSize);
        }
        stream = fs.createWriteStream(file, { flags: 'a' });
    }
    if (!stream) {
        return false;
    }
    stream.write([date, ' ', get_now_time_1.default(), ' ', text, os.EOL].join(''));
    return true;
}
exports.default = default_1;
function dateDetermination(d) {
    const now = get_now_date_1.default();
    if (d !== now) {
        stream = undefined;
        file = undefined;
    }
    return now;
}
function logRotate(file, maxSize) {
    try {
        const stat = fs.statSync(file);
        if (stat.size > maxSize) {
            fs.renameSync(file, file.replace(/log$/, 'old.log'));
        }
    }
    catch (e) {
        // error
    }
}
