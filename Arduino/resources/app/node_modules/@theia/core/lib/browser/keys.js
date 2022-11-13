"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.KeysOrKeyCodes = exports.SpecialCases = exports.Key = exports.KeyModifier = exports.KeyCode = exports.KeySequence = void 0;
// Reexporting here for backwards compatibility.
// Please import from '@theia/core/lib/browser' or '@theia/core/lib/browser/keyboard' instead of this module.
// This module might be removed in future releases.
const keys_1 = require("./keyboard/keys");
Object.defineProperty(exports, "KeySequence", { enumerable: true, get: function () { return keys_1.KeySequence; } });
Object.defineProperty(exports, "KeyCode", { enumerable: true, get: function () { return keys_1.KeyCode; } });
Object.defineProperty(exports, "KeyModifier", { enumerable: true, get: function () { return keys_1.KeyModifier; } });
Object.defineProperty(exports, "Key", { enumerable: true, get: function () { return keys_1.Key; } });
Object.defineProperty(exports, "SpecialCases", { enumerable: true, get: function () { return keys_1.SpecialCases; } });
Object.defineProperty(exports, "KeysOrKeyCodes", { enumerable: true, get: function () { return keys_1.KeysOrKeyCodes; } });
//# sourceMappingURL=keys.js.map