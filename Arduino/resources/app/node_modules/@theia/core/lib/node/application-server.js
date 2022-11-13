"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.ApplicationServerImpl = void 0;
const inversify_1 = require("inversify");
const application_package_1 = require("@theia/application-package");
const os_1 = require("../common/os");
let ApplicationServerImpl = class ApplicationServerImpl {
    getExtensionsInfos() {
        const extensions = this.applicationPackage.extensionPackages;
        const infos = extensions.map(extension => ({ name: extension.name, version: extension.version }));
        return Promise.resolve(infos);
    }
    getApplicationInfo() {
        const pck = this.applicationPackage.pck;
        if (pck.name && pck.version) {
            const name = pck.name;
            const version = pck.version;
            return Promise.resolve({ name, version });
        }
        return Promise.resolve(undefined);
    }
    async getBackendOS() {
        return os_1.OS.type();
    }
};
__decorate([
    (0, inversify_1.inject)(application_package_1.ApplicationPackage),
    __metadata("design:type", application_package_1.ApplicationPackage)
], ApplicationServerImpl.prototype, "applicationPackage", void 0);
ApplicationServerImpl = __decorate([
    (0, inversify_1.injectable)()
], ApplicationServerImpl);
exports.ApplicationServerImpl = ApplicationServerImpl;
//# sourceMappingURL=application-server.js.map