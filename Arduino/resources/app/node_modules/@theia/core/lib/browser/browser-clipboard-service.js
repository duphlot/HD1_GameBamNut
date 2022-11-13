"use strict";
// *****************************************************************************
// Copyright (C) 2019 RedHat and others.
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
exports.BrowserClipboardService = void 0;
const inversify_1 = require("inversify");
const browser_1 = require("./browser");
const logger_1 = require("../common/logger");
const message_service_1 = require("../common/message-service");
let BrowserClipboardService = class BrowserClipboardService {
    async readText() {
        let permission;
        try {
            permission = await this.queryPermission('clipboard-read');
        }
        catch (e1) {
            this.logger.error('Failed checking a clipboard-read permission.', e1);
            // in FireFox, Clipboard API isn't gated with the permissions
            try {
                return await this.getClipboardAPI().readText();
            }
            catch (e2) {
                this.logger.error('Failed reading clipboard content.', e2);
                if (browser_1.isFirefox) {
                    this.messageService.warn(`Clipboard API is not available.
                    It can be enabled by 'dom.events.testing.asyncClipboard' preference on 'about:config' page. Then reload Theia.
                    Note, it will allow FireFox getting full access to the system clipboard.`);
                }
                return '';
            }
        }
        if (permission.state === 'denied') {
            // most likely, the user intentionally denied the access
            this.messageService.warn("Access to the clipboard is denied. Check your browser's permission.");
            return '';
        }
        return this.getClipboardAPI().readText();
    }
    async writeText(value) {
        let permission;
        try {
            permission = await this.queryPermission('clipboard-write');
        }
        catch (e1) {
            this.logger.error('Failed checking a clipboard-write permission.', e1);
            // in FireFox, Clipboard API isn't gated with the permissions
            try {
                await this.getClipboardAPI().writeText(value);
                return;
            }
            catch (e2) {
                this.logger.error('Failed writing to the clipboard.', e2);
                if (browser_1.isFirefox) {
                    this.messageService.warn(`Clipboard API is not available.
                    It can be enabled by 'dom.events.testing.asyncClipboard' preference on 'about:config' page. Then reload Theia.
                    Note, it will allow FireFox getting full access to the system clipboard.`);
                }
                return;
            }
        }
        if (permission.state === 'denied') {
            // most likely, the user intentionally denied the access
            this.messageService.warn("Access to the clipboard is denied. Check your browser's permission.");
            return;
        }
        return this.getClipboardAPI().writeText(value);
    }
    async queryPermission(name) {
        if ('permissions' in navigator) {
            return navigator['permissions'].query({ name: name });
        }
        throw new Error('Permissions API unavailable');
    }
    getClipboardAPI() {
        if ('clipboard' in navigator) {
            return navigator['clipboard'];
        }
        throw new Error('Async Clipboard API unavailable');
    }
};
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], BrowserClipboardService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], BrowserClipboardService.prototype, "logger", void 0);
BrowserClipboardService = __decorate([
    (0, inversify_1.injectable)()
], BrowserClipboardService);
exports.BrowserClipboardService = BrowserClipboardService;
//# sourceMappingURL=browser-clipboard-service.js.map