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
exports.LocalStorageService = exports.StorageService = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../common/logger");
const message_service_1 = require("../common/message-service");
const window_service_1 = require("./window/window-service");
const environment_1 = require("@theia/application-package/lib/environment");
exports.StorageService = Symbol('IStorageService');
let LocalStorageService = class LocalStorageService {
    init() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.storage = window.localStorage;
            this.testLocalStorage();
        }
        else {
            this.logger.warn(log => log("The browser doesn't support localStorage. state will not be persisted across sessions."));
            this.storage = {};
        }
    }
    setData(key, data) {
        if (data !== undefined) {
            try {
                this.storage[this.prefix(key)] = JSON.stringify(data);
            }
            catch (e) {
                this.showDiskQuotaExceededMessage();
            }
        }
        else {
            delete this.storage[this.prefix(key)];
        }
        return Promise.resolve();
    }
    getData(key, defaultValue) {
        const result = this.storage[this.prefix(key)];
        if (result === undefined) {
            return Promise.resolve(defaultValue);
        }
        return Promise.resolve(JSON.parse(result));
    }
    prefix(key) {
        if (environment_1.environment.electron.is()) {
            return `theia:${key}`;
        }
        const pathname = typeof window === 'undefined' ? '' : window.location.pathname;
        return `theia:${pathname}:${key}`;
    }
    async showDiskQuotaExceededMessage() {
        const READ_INSTRUCTIONS_ACTION = 'Read Instructions';
        const CLEAR_STORAGE_ACTION = 'Clear Local Storage';
        const ERROR_MESSAGE = `Your preferred browser's local storage is almost full.
        To be able to save your current workspace layout or data, you may need to free up some space.
        You can refer to Theia's documentation page for instructions on how to manually clean
        your browser's local storage or choose to clear all.`;
        this.messageService.warn(ERROR_MESSAGE, READ_INSTRUCTIONS_ACTION, CLEAR_STORAGE_ACTION).then(async (selected) => {
            if (READ_INSTRUCTIONS_ACTION === selected) {
                this.windowService.openNewWindow('https://github.com/eclipse-theia/theia/wiki/Cleaning-Local-Storage', { external: true });
            }
            else if (CLEAR_STORAGE_ACTION === selected) {
                this.clearStorage();
            }
        });
    }
    /**
     * Verify if there is still some spaces left to save another workspace configuration into the local storage of your browser.
     * If we are close to the limit, use a dialog to notify the user.
     */
    testLocalStorage() {
        const keyTest = this.prefix('Test');
        try {
            this.storage[keyTest] = JSON.stringify(new Array(60000));
        }
        catch (error) {
            this.showDiskQuotaExceededMessage();
        }
        finally {
            this.storage.removeItem(keyTest);
        }
    }
    clearStorage() {
        this.storage.clear();
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], LocalStorageService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], LocalStorageService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], LocalStorageService.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocalStorageService.prototype, "init", null);
LocalStorageService = __decorate([
    (0, inversify_1.injectable)()
], LocalStorageService);
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=storage-service.js.map