"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIpcEnv = exports.checkParentAlive = exports.IPCEntryPoint = exports.ipcEntryPoint = void 0;
const THEIA_PARENT_PID = 'THEIA_PARENT_PID';
const THEIA_ENTRY_POINT = 'THEIA_ENTRY_POINT';
exports.ipcEntryPoint = process.env[THEIA_ENTRY_POINT];
var IPCEntryPoint;
(function (IPCEntryPoint) {
    /**
     * Throws if `THEIA_ENTRY_POINT` is undefined or empty.
     */
    function getScriptFromEnv() {
        if (!exports.ipcEntryPoint) {
            throw new Error(`"${THEIA_ENTRY_POINT}" is missing from the environment`);
        }
        return exports.ipcEntryPoint;
    }
    IPCEntryPoint.getScriptFromEnv = getScriptFromEnv;
})(IPCEntryPoint = exports.IPCEntryPoint || (exports.IPCEntryPoint = {}));
/**
 * Exit the current process if the parent process is not alive.
 * Relevant only for some OS, like Windows
 */
function checkParentAlive() {
    if (process.env[THEIA_PARENT_PID]) {
        const parentPid = Number(process.env[THEIA_PARENT_PID]);
        if (typeof parentPid === 'number' && !isNaN(parentPid)) {
            setInterval(() => {
                try {
                    // throws an exception if the main process doesn't exist anymore.
                    process.kill(parentPid, 0);
                }
                catch (_a) {
                    process.exit();
                }
            }, 5000);
        }
    }
}
exports.checkParentAlive = checkParentAlive;
function createIpcEnv(options) {
    const op = Object.assign({}, options);
    const childEnv = Object.assign({}, op.env);
    for (const key of Object.keys(childEnv)) {
        if (key.startsWith('THEIA_')) {
            delete childEnv[key];
        }
    }
    childEnv[THEIA_PARENT_PID] = String(process.pid);
    childEnv[THEIA_ENTRY_POINT] = op.entryPoint;
    return childEnv;
}
exports.createIpcEnv = createIpcEnv;
//# sourceMappingURL=ipc-protocol.js.map