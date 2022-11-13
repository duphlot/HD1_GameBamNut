"use strict";
/* eslint-disable */
// copied from https://github.com/microsoft/vscode/blob/1.37.0/src/vs/base/common/objects.ts
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneAndChange = void 0;
const types_1 = require("./types");
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function cloneAndChange(obj, changer) {
    return _cloneAndChange(obj, changer, new Set());
}
exports.cloneAndChange = cloneAndChange;
function _cloneAndChange(obj, changer, seen) {
    if ((0, types_1.isUndefinedOrNull)(obj)) {
        return obj;
    }
    const changed = changer(obj);
    if (typeof changed !== 'undefined') {
        return changed;
    }
    if ((0, types_1.isArray)(obj)) {
        const r1 = [];
        for (const e of obj) {
            r1.push(_cloneAndChange(e, changer, seen));
        }
        return r1;
    }
    if ((0, types_1.isObject)(obj)) {
        if (seen.has(obj)) {
            throw new Error('Cannot clone recursive data-structure');
        }
        seen.add(obj);
        const r2 = {};
        for (let i2 in obj) {
            if (_hasOwnProperty.call(obj, i2)) {
                r2[i2] = _cloneAndChange(obj[i2], changer, seen);
            }
        }
        seen.delete(obj);
        return r2;
    }
    return obj;
}
//# sourceMappingURL=objects.js.map