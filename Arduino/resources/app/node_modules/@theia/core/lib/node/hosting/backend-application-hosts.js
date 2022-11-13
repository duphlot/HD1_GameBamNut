"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.BackendApplicationHosts = void 0;
const inversify_1 = require("inversify");
/**
 * **Important: This component is not bound on Electron.**
 *
 * Component handling the different hosts the Theia backend should be reachable at.
 *
 * Hosts should be set through the `THEIA_HOSTS` environment variable as a comma-separated list of hosts.
 *
 * If you do not set this variable, we'll consider that we don't know where the application is hosted at.
 */
let BackendApplicationHosts = class BackendApplicationHosts {
    constructor() {
        this._hosts = new Set();
    }
    /**
     * Set of domains that the application is supposed to be reachable at.
     * If the set is empty it means that we don't know where we are hosted.
     * You can check for this with `.hasKnownHosts()`.
     */
    get hosts() {
        return this._hosts;
    }
    postConstruct() {
        const theiaHostsEnv = process.env['THEIA_HOSTS'];
        if (theiaHostsEnv) {
            theiaHostsEnv.split(',').forEach(host => {
                const trimmed = host.trim();
                if (trimmed.length > 0) {
                    this._hosts.add(trimmed);
                }
            });
        }
    }
    /**
     * Do we know where we are hosted?
     */
    hasKnownHosts() {
        return this._hosts.size > 0;
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BackendApplicationHosts.prototype, "postConstruct", null);
BackendApplicationHosts = __decorate([
    (0, inversify_1.injectable)()
], BackendApplicationHosts);
exports.BackendApplicationHosts = BackendApplicationHosts;
//# sourceMappingURL=backend-application-hosts.js.map