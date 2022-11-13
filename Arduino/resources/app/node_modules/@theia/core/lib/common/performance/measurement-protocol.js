"use strict";
/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
*******************************************************************************/
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
exports.NullBackendStopwatch = exports.DefaultBackendStopwatch = exports.BackendStopwatchOptions = exports.stopwatchPath = exports.BackendStopwatch = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("inversify");
const stopwatch_1 = require("./stopwatch");
exports.BackendStopwatch = Symbol('BackendStopwatch');
/** API path of the stopwatch service that exposes the back-end stopwatch to clients. */
exports.stopwatchPath = '/services/stopwatch';
exports.BackendStopwatchOptions = Symbol('BackendStopwatchOptions');
/**
 * Default implementation of the (remote) back-end stopwatch service.
 */
let DefaultBackendStopwatch = class DefaultBackendStopwatch {
    constructor() {
        this.measurements = new Map();
        this.idSequence = 0;
    }
    start(name, options) {
        const result = ++this.idSequence;
        this.measurements.set(result, this.stopwatch.start(name, options));
        return result;
    }
    stop(measurementToken, message, messageArgs) {
        const measurement = this.measurements.get(measurementToken);
        if (measurement) {
            this.measurements.delete(measurementToken);
            measurement.log(message, ...messageArgs);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(stopwatch_1.Stopwatch),
    __metadata("design:type", stopwatch_1.Stopwatch)
], DefaultBackendStopwatch.prototype, "stopwatch", void 0);
DefaultBackendStopwatch = __decorate([
    (0, inversify_1.injectable)()
], DefaultBackendStopwatch);
exports.DefaultBackendStopwatch = DefaultBackendStopwatch;
/**
 * No-op implementation of the (remote) back-end stopwatch service.
 */
let NullBackendStopwatch = class NullBackendStopwatch {
    start() {
        return Promise.resolve(0);
    }
    stop() {
        return Promise.resolve();
    }
};
NullBackendStopwatch = __decorate([
    (0, inversify_1.injectable)()
], NullBackendStopwatch);
exports.NullBackendStopwatch = NullBackendStopwatch;
//# sourceMappingURL=measurement-protocol.js.map