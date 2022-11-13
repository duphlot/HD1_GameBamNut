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
exports.bindBackendStopwatch = exports.bindFrontendStopwatch = void 0;
const common_1 = require("../../common");
const messaging_1 = require("../messaging");
const frontend_stopwatch_1 = require("./frontend-stopwatch");
function bindFrontendStopwatch(bind) {
    return bind(common_1.Stopwatch).to(frontend_stopwatch_1.FrontendStopwatch).inSingletonScope();
}
exports.bindFrontendStopwatch = bindFrontendStopwatch;
function bindBackendStopwatch(bind) {
    return bind(common_1.BackendStopwatch).toDynamicValue(({ container }) => {
        const connection = container.get(messaging_1.WebSocketConnectionProvider);
        return connection.createProxy(common_1.stopwatchPath);
    }).inSingletonScope();
}
exports.bindBackendStopwatch = bindBackendStopwatch;
//# sourceMappingURL=measurement-frontend-bindings.js.map