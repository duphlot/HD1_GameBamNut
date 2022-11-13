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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const node_1 = require("../../node");
const ws_request_validators_1 = require("../../node/ws-request-validators");
const electron_token_backend_contribution_1 = require("./electron-token-backend-contribution");
const electron_token_validator_1 = require("./electron-token-validator");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(electron_token_backend_contribution_1.ElectronTokenBackendContribution).toSelf().inSingletonScope();
    bind(node_1.BackendApplicationContribution).toService(electron_token_backend_contribution_1.ElectronTokenBackendContribution);
    bind(electron_token_validator_1.ElectronTokenValidator).toSelf().inSingletonScope();
    bind(ws_request_validators_1.WsRequestValidatorContribution).toService(electron_token_validator_1.ElectronTokenValidator);
});
//# sourceMappingURL=electron-token-backend-module.js.map