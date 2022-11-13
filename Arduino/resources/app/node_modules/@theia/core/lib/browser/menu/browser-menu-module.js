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
const inversify_1 = require("inversify");
const frontend_application_1 = require("../frontend-application");
const context_menu_renderer_1 = require("../context-menu-renderer");
const browser_menu_plugin_1 = require("./browser-menu-plugin");
const browser_context_menu_renderer_1 = require("./browser-context-menu-renderer");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(browser_menu_plugin_1.BrowserMainMenuFactory).toSelf().inSingletonScope();
    bind(context_menu_renderer_1.ContextMenuRenderer).to(browser_context_menu_renderer_1.BrowserContextMenuRenderer).inSingletonScope();
    bind(browser_menu_plugin_1.BrowserMenuBarContribution).toSelf().inSingletonScope();
    bind(frontend_application_1.FrontendApplicationContribution).toService(browser_menu_plugin_1.BrowserMenuBarContribution);
});
//# sourceMappingURL=browser-menu-module.js.map