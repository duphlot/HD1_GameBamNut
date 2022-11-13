"use strict";
/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
*******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindBackendStopwatchServer = exports.bindNodeStopwatch = void 0;
const common_1 = require("../../common");
const node_stopwatch_1 = require("./node-stopwatch");
function bindNodeStopwatch(bind) {
    return bind(common_1.Stopwatch).to(node_stopwatch_1.NodeStopwatch).inSingletonScope();
}
exports.bindNodeStopwatch = bindNodeStopwatch;
function bindBackendStopwatchServer(bind) {
    bind(common_1.ConnectionHandler).toDynamicValue(({ container }) => new common_1.JsonRpcConnectionHandler(common_1.stopwatchPath, () => container.get(common_1.BackendStopwatch))).inSingletonScope();
    bind(common_1.DefaultBackendStopwatch).toSelf().inSingletonScope();
    return bind(common_1.BackendStopwatch).to(common_1.DefaultBackendStopwatch).inSingletonScope();
}
exports.bindBackendStopwatchServer = bindBackendStopwatchServer;
//# sourceMappingURL=measurement-backend-bindings.js.map