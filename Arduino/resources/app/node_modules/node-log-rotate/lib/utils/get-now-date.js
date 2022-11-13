"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
function default_1() {
    return `${moment().get('year')}-${_.padStart(moment().get('month') + 1 + '', 2, '0')}-${_.padStart(moment().get('date') + '', 2, '0')}`;
}
exports.default = default_1;
