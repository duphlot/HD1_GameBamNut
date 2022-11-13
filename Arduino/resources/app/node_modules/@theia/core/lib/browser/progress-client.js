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
exports.DispatchingProgressClient = void 0;
const inversify_1 = require("inversify");
const progress_status_bar_item_1 = require("./progress-status-bar-item");
const progress_location_service_1 = require("./progress-location-service");
let DispatchingProgressClient = class DispatchingProgressClient {
    showProgress(progressId, message, cancellationToken) {
        const locationId = this.getLocationId(message);
        if (locationId === 'window') {
            return this.statusBarItem.showProgress(progressId, message, cancellationToken);
        }
        return this.locationService.showProgress(progressId, message, cancellationToken);
    }
    reportProgress(progressId, update, message, cancellationToken) {
        const locationId = this.getLocationId(message);
        if (locationId === 'window') {
            return this.statusBarItem.reportProgress(progressId, update, message, cancellationToken);
        }
        return this.locationService.reportProgress(progressId, update, message, cancellationToken);
    }
    getLocationId(message) {
        return message.options && message.options.location || 'unknownLocation';
    }
};
__decorate([
    (0, inversify_1.inject)(progress_status_bar_item_1.ProgressStatusBarItem),
    __metadata("design:type", progress_status_bar_item_1.ProgressStatusBarItem)
], DispatchingProgressClient.prototype, "statusBarItem", void 0);
__decorate([
    (0, inversify_1.inject)(progress_location_service_1.ProgressLocationService),
    __metadata("design:type", progress_location_service_1.ProgressLocationService)
], DispatchingProgressClient.prototype, "locationService", void 0);
DispatchingProgressClient = __decorate([
    (0, inversify_1.injectable)()
], DispatchingProgressClient);
exports.DispatchingProgressClient = DispatchingProgressClient;
//# sourceMappingURL=progress-client.js.map