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
exports.ElectronTokenBackendContribution = void 0;
const inversify_1 = require("inversify");
const electron_token_validator_1 = require("./electron-token-validator");
/**
 * This component contributes an Express middleware that will refuse all
 * requests that do not include a specific token.
 */
let ElectronTokenBackendContribution = class ElectronTokenBackendContribution {
    configure(app) {
        app.use(this.expressMiddleware.bind(this));
    }
    /**
     * Only allow token-bearers.
     */
    expressMiddleware(req, res, next) {
        if (this.tokenValidator.allowRequest(req)) {
            next();
        }
        else {
            console.error(`refused an http request: ${req.connection.remoteAddress}`);
            res.sendStatus(403);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(electron_token_validator_1.ElectronTokenValidator),
    __metadata("design:type", electron_token_validator_1.ElectronTokenValidator)
], ElectronTokenBackendContribution.prototype, "tokenValidator", void 0);
ElectronTokenBackendContribution = __decorate([
    (0, inversify_1.injectable)()
], ElectronTokenBackendContribution);
exports.ElectronTokenBackendContribution = ElectronTokenBackendContribution;
//# sourceMappingURL=electron-token-backend-contribution.js.map