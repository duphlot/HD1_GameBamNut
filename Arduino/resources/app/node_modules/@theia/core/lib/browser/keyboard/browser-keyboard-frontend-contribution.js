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
exports.BrowserKeyboardFrontendContribution = exports.KeyboardCommands = void 0;
const inversify_1 = require("inversify");
const os_1 = require("../../common/os");
const command_1 = require("../../common/command");
const browser_keyboard_layout_provider_1 = require("./browser-keyboard-layout-provider");
const quick_input_1 = require("../quick-input");
const nls_1 = require("../../common/nls");
var KeyboardCommands;
(function (KeyboardCommands) {
    const KEYBOARD_CATEGORY = 'Keyboard';
    const KEYBOARD_CATEGORY_KEY = nls_1.nls.getDefaultKey(KEYBOARD_CATEGORY);
    KeyboardCommands.CHOOSE_KEYBOARD_LAYOUT = command_1.Command.toLocalizedCommand({
        id: 'core.keyboard.choose',
        category: KEYBOARD_CATEGORY,
        label: 'Choose Keyboard Layout',
    }, 'theia/core/keyboard/choose', KEYBOARD_CATEGORY_KEY);
})(KeyboardCommands = exports.KeyboardCommands || (exports.KeyboardCommands = {}));
let BrowserKeyboardFrontendContribution = class BrowserKeyboardFrontendContribution {
    registerCommands(commandRegistry) {
        commandRegistry.registerCommand(KeyboardCommands.CHOOSE_KEYBOARD_LAYOUT, {
            execute: () => this.chooseLayout()
        });
    }
    async chooseLayout() {
        var _a;
        const current = this.layoutProvider.currentLayoutData;
        const autodetect = {
            label: nls_1.nls.localizeByDefault('Auto Detect'),
            description: this.layoutProvider.currentLayoutSource !== 'user-choice' ? nls_1.nls.localize('theia/core/keyboard/current', '(current: {0})', current.name) : undefined,
            detail: nls_1.nls.localize('theia/core/keyboard/tryDetect', 'Try to detect the keyboard layout from browser information and pressed keys.'),
            value: 'autodetect'
        };
        const pcLayouts = this.layoutProvider.allLayoutData
            .filter(layout => layout.hardware === 'pc')
            .sort((a, b) => compare(a.name, b.name))
            .map(layout => this.toQuickPickValue(layout, current === layout));
        const macLayouts = this.layoutProvider.allLayoutData
            .filter(layout => layout.hardware === 'mac')
            .sort((a, b) => compare(a.name, b.name))
            .map(layout => this.toQuickPickValue(layout, current === layout));
        let layouts;
        const macKeyboards = nls_1.nls.localize('theia/core/keyboard/mac', 'Mac Keyboards');
        const pcKeyboards = nls_1.nls.localize('theia/core/keyboard/pc', 'PC Keyboards');
        if (os_1.isOSX) {
            layouts = [
                autodetect,
                { type: 'separator', label: macKeyboards }, ...macLayouts,
                { type: 'separator', label: pcKeyboards }, ...pcLayouts
            ];
        }
        else {
            layouts = [
                autodetect,
                { type: 'separator', label: pcKeyboards }, ...pcLayouts,
                { type: 'separator', label: macKeyboards }, ...macLayouts
            ];
        }
        const selectedItem = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(layouts, { placeholder: nls_1.nls.localize('theia/core/keyboard/chooseLayout', 'Choose a keyboard layout') }));
        if (selectedItem && ('value' in selectedItem)) {
            return this.layoutProvider.setLayoutData(selectedItem.value);
        }
    }
    toQuickPickValue(layout, isCurrent) {
        return {
            label: layout.name,
            description: `${layout.hardware === 'mac' ? 'Mac' : 'PC'} (${layout.language})${isCurrent ? nls_1.nls.localize('theia/core/keyboard/currentLayout', ' - current layout') : ''}`,
            value: layout
        };
    }
};
__decorate([
    (0, inversify_1.inject)(browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider),
    __metadata("design:type", browser_keyboard_layout_provider_1.BrowserKeyboardLayoutProvider)
], BrowserKeyboardFrontendContribution.prototype, "layoutProvider", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], BrowserKeyboardFrontendContribution.prototype, "quickInputService", void 0);
BrowserKeyboardFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], BrowserKeyboardFrontendContribution);
exports.BrowserKeyboardFrontendContribution = BrowserKeyboardFrontendContribution;
function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
//# sourceMappingURL=browser-keyboard-frontend-contribution.js.map