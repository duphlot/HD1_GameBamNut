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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowContribution = exports.WindowCommands = void 0;
const inversify_1 = require("inversify");
const common_1 = require("../common");
const window_service_1 = require("./window/window-service");
const common_frontend_contribution_1 = require("../browser/common-frontend-contribution");
var WindowCommands;
(function (WindowCommands) {
    WindowCommands.NEW_WINDOW = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.newWindow',
        label: 'New Window'
    });
})(WindowCommands = exports.WindowCommands || (exports.WindowCommands = {}));
let WindowContribution = class WindowContribution {
    registerCommands(commands) {
        commands.registerCommand(WindowCommands.NEW_WINDOW, {
            execute: () => {
                this.windowService.openNewDefaultWindow();
            }
        });
    }
    registerKeybindings(registry) {
        registry.registerKeybindings({
            command: WindowCommands.NEW_WINDOW.id,
            keybinding: this.isElectron() ? 'ctrlcmd+shift+n' : 'alt+shift+n'
        });
    }
    registerMenus(registry) {
        registry.registerMenuAction(common_frontend_contribution_1.CommonMenus.FILE_NEW, {
            commandId: WindowCommands.NEW_WINDOW.id,
            order: 'c'
        });
    }
    isElectron() {
        return common_1.environment.electron.is();
    }
};
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], WindowContribution.prototype, "windowService", void 0);
WindowContribution = __decorate([
    (0, inversify_1.injectable)()
], WindowContribution);
exports.WindowContribution = WindowContribution;
//# sourceMappingURL=window-contribution.js.map