"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.CurrentWidgetCommandAdapter = void 0;
/**
 * Creates a command handler that acts on either the widget targeted by a DOM event or the current widget.
 */
class CurrentWidgetCommandAdapter {
    constructor(shell, handler) {
        this.execute = (event) => handler.execute(...this.transformArguments(shell, event));
        if (handler.isEnabled) {
            this.isEnabled = (event) => { var _a; return !!((_a = handler.isEnabled) === null || _a === void 0 ? void 0 : _a.call(handler, ...this.transformArguments(shell, event))); };
        }
        if (handler.isVisible) {
            this.isVisible = (event) => { var _a; return !!((_a = handler.isVisible) === null || _a === void 0 ? void 0 : _a.call(handler, ...this.transformArguments(shell, event))); };
        }
        if (handler.isToggled) {
            this.isToggled = (event) => { var _a; return !!((_a = handler.isToggled) === null || _a === void 0 ? void 0 : _a.call(handler, ...this.transformArguments(shell, event))); };
        }
    }
    transformArguments(shell, event) {
        const tabBar = shell.findTabBar(event);
        const title = tabBar && shell.findTitle(tabBar, event);
        return [title, tabBar, event];
    }
}
exports.CurrentWidgetCommandAdapter = CurrentWidgetCommandAdapter;
//# sourceMappingURL=current-widget-command-adapter.js.map