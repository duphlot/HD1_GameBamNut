"use strict";
/********************************************************************************
* Copyright (c) 2019, 2021 TypeFox, STMicroelectronics and others.
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
exports.FrontendStopwatch = void 0;
const inversify_1 = require("inversify");
const common_1 = require("../../common");
let FrontendStopwatch = class FrontendStopwatch extends common_1.Stopwatch {
    constructor() {
        super({
            owner: 'frontend',
            now: () => performance.now(),
        });
    }
    start(name, options) {
        const startMarker = `${name}-start`;
        const endMarker = `${name}-end`;
        performance.clearMeasures(name);
        performance.clearMarks(startMarker);
        performance.clearMarks(endMarker);
        performance.mark(startMarker);
        return this.createMeasurement(name, () => {
            performance.mark(endMarker);
            let duration;
            try {
                performance.measure(name, startMarker, endMarker);
                const entries = performance.getEntriesByName(name);
                // If no entries, then performance measurement was disabled or failed, so
                // signal that with a `NaN` result
                duration = entries.length > 0 ? entries[0].duration : Number.NaN;
            }
            catch (e) {
                console.warn(e);
                duration = Number.NaN;
            }
            performance.clearMeasures(name);
            performance.clearMarks(startMarker);
            performance.clearMarks(endMarker);
            return duration;
        }, options);
    }
};
FrontendStopwatch = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], FrontendStopwatch);
exports.FrontendStopwatch = FrontendStopwatch;
;
//# sourceMappingURL=frontend-stopwatch.js.map