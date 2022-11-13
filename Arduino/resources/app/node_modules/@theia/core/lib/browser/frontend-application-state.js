"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.FrontendApplicationStateService = void 0;
const inversify_1 = require("inversify");
const event_1 = require("../common/event");
const promise_util_1 = require("../common/promise-util");
const logger_1 = require("../common/logger");
let FrontendApplicationStateService = class FrontendApplicationStateService {
    constructor() {
        this._state = 'init';
        this.deferred = {};
        this.stateChanged = new event_1.Emitter();
    }
    get state() {
        return this._state;
    }
    set state(state) {
        if (state !== this._state) {
            this.doSetState(state);
        }
    }
    get onStateChanged() {
        return this.stateChanged.event;
    }
    doSetState(state) {
        if (this.deferred[this._state] === undefined) {
            this.deferred[this._state] = new promise_util_1.Deferred();
        }
        const oldState = this._state;
        this._state = state;
        if (this.deferred[state] === undefined) {
            this.deferred[state] = new promise_util_1.Deferred();
        }
        this.deferred[state].resolve();
        this.logger.info(`Changed application state from '${oldState}' to '${this._state}'.`);
        this.stateChanged.fire(state);
    }
    reachedState(state) {
        if (this.deferred[state] === undefined) {
            this.deferred[state] = new promise_util_1.Deferred();
        }
        return this.deferred[state].promise;
    }
    reachedAnyState(...states) {
        return Promise.race(states.map(s => this.reachedState(s)));
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], FrontendApplicationStateService.prototype, "logger", void 0);
FrontendApplicationStateService = __decorate([
    (0, inversify_1.injectable)()
], FrontendApplicationStateService);
exports.FrontendApplicationStateService = FrontendApplicationStateService;
//# sourceMappingURL=frontend-application-state.js.map