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
const inversify_1 = require("inversify");
const command_1 = require("../../common/command");
const keyboard_layout_provider_1 = require("../../common/keyboard/keyboard-layout-provider");
const browser_keyboard_layout_provider_1 = require("./browser-keyboard-layout-provider");
const browser_keyboard_frontend_contribution_1 = require("./browser-keyboard-frontend-contribution");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider).toSelf().inSingletonScope();
    bind(keyboard_layout_provider_1.KeyboardLayoutProvider).toService(browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider);
    bind(keyboard_layout_provider_1.KeyboardLayoutChangeNotifier).toService(browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider);
    bind(keyboard_layout_provider_1.KeyValidator).toService(browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider);
    bind(browser_keyboard_frontend_contribution_1.BrowserKeyboardFrontendContribution).toSelf().inSingletonScope();
    bind(command_1.CommandContribution).toService(browser_keyboard_frontend_contribution_1.BrowserKeyboardFrontendContribution);
});
//# sourceMappingURL=browser-keyboard-module.js.map