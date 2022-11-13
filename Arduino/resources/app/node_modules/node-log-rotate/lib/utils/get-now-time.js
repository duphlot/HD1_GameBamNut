"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
function default_1() {
    let now = moment();
    return `${_.padStart(now.hours() + '', 2, '0')}:${_.padStart(now.minute() + '', 2, '0')}:${_.padStart(now.second() + '', 2, '0')}`;
}
exports.default = default_1;
