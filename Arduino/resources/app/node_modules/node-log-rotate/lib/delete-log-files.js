"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");
const find_log_path_1 = require("./utils/find-log-path");
const format = 'YYYY-MM-DD';
function default_1(howManyDaysAgo, appName) {
    const path = find_log_path_1.default(appName);
    let files = [];
    try {
        files = fs.readdirSync(path);
    }
    catch (e) {
        return null;
    }
    _.forEach(files, (file, index) => {
        const yearMonthDay = getYearMonthDay(file);
        if (!yearMonthDay) {
            return;
        }
        if (!isBefore(howManyDaysAgo, yearMonthDay)) {
            return;
        }
        deleteLogFile(path + file);
    });
}
exports.default = default_1;
function getYearMonthDay(file) {
    const split = _.split(file, '-', 3);
    if (split.length < 3) {
        return null;
    }
    return {
        year: split[0],
        month: split[1],
        day: _.split(split[2], '_', 1)[0],
    };
}
function isBefore(howManyDaysAgo, yearMonthDay) {
    const agoDays = moment(moment().format(format)).subtract(howManyDaysAgo, 'days');
    const fileDays = moment([yearMonthDay.year, yearMonthDay.month, yearMonthDay.day].join('-'));
    return moment(fileDays).isBefore(agoDays);
}
function deleteLogFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    }
    catch (e) {
        return null;
    }
}
