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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressLocationService = void 0;
const inversify_1 = require("inversify");
const message_service_protocol_1 = require("../common/message-service-protocol");
const promise_util_1 = require("../common/promise-util");
const event_1 = require("../common/event");
let ProgressLocationService = class ProgressLocationService {
    constructor() {
        this.emitters = new Map();
        this.lastEvents = new Map();
        this.progressByLocation = new Map();
    }
    getProgress(locationId) {
        return this.lastEvents.get(locationId);
    }
    onProgress(locationId) {
        const emitter = this.addEmitter(locationId);
        return emitter.event;
    }
    addEmitter(locationId) {
        const emitter = new event_1.Emitter();
        const list = this.emitters.get(locationId) || [];
        list.push(emitter);
        this.emitters.set(locationId, list);
        return emitter;
    }
    async showProgress(progressId, message, cancellationToken) {
        const locationId = this.getLocationId(message);
        const result = new promise_util_1.Deferred();
        cancellationToken.onCancellationRequested(() => {
            this.processEvent(progressId, locationId, 'done');
            result.resolve(message_service_protocol_1.ProgressMessage.Cancel);
        });
        this.processEvent(progressId, locationId, 'start');
        return result.promise;
    }
    processEvent(progressId, locationId, event) {
        const progressSet = this.progressByLocation.get(locationId) || new Set();
        if (event === 'start') {
            progressSet.add(progressId);
        }
        else {
            progressSet.delete(progressId);
        }
        this.progressByLocation.set(locationId, progressSet);
        const show = !!progressSet.size;
        this.fireEvent(locationId, show);
    }
    fireEvent(locationId, show) {
        const lastEvent = this.lastEvents.get(locationId);
        const shouldFire = !lastEvent || lastEvent.show !== show;
        if (shouldFire) {
            this.lastEvents.set(locationId, { show });
            this.getOrCreateEmitters(locationId).forEach(e => e.fire({ show }));
        }
    }
    getOrCreateEmitters(locationId) {
        let emitters = this.emitters.get(locationId);
        if (!emitters) {
            emitters = [this.addEmitter(locationId)];
        }
        return emitters;
    }
    getLocationId(message) {
        return message.options && message.options.location || 'unknownLocation';
    }
    async reportProgress(progressId, update, message, cancellationToken) {
        /* NOOP */
    }
};
ProgressLocationService = __decorate([
    (0, inversify_1.injectable)()
], ProgressLocationService);
exports.ProgressLocationService = ProgressLocationService;
//# sourceMappingURL=progress-location-service.js.map