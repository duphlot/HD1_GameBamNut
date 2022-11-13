"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.createDisposableListener = void 0;
const common_1 = require("../common");
function createDisposableListener(emitter, signal, handler, collection) {
    emitter.on(signal, handler);
    const disposable = common_1.Disposable.create(() => { try {
        emitter.off(signal, handler);
    }
    catch (_a) { } });
    if (collection) {
        collection.push(disposable);
    }
    else {
        return disposable;
    }
}
exports.createDisposableListener = createDisposableListener;
//# sourceMappingURL=event-utils.js.map