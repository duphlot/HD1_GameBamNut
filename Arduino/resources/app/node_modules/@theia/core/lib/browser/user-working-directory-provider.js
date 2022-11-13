"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.UserWorkingDirectoryProvider = void 0;
const inversify_1 = require("inversify");
const uri_1 = require("../common/uri");
const common_1 = require("../common");
const env_variables_1 = require("../common/env-variables");
let UserWorkingDirectoryProvider = class UserWorkingDirectoryProvider {
    /**
     * @returns A {@link URI} that represents a good guess about the directory in which the user is currently operating.
     *
     * Factors considered may include the current widget, current selection, user home directory, or other application state.
     */
    async getUserWorkingDir() {
        var _a;
        return (_a = await this.getFromSelection()) !== null && _a !== void 0 ? _a : this.getFromUserHome();
    }
    getFromSelection() {
        return this.ensureIsDirectory(common_1.UriSelection.getUri(this.selectionService.selection));
    }
    getFromUserHome() {
        return this.envVariables.getHomeDirUri().then(home => new uri_1.default(home));
    }
    ensureIsDirectory(uri) {
        return uri === null || uri === void 0 ? void 0 : uri.parent;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], UserWorkingDirectoryProvider.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], UserWorkingDirectoryProvider.prototype, "envVariables", void 0);
UserWorkingDirectoryProvider = __decorate([
    (0, inversify_1.injectable)()
], UserWorkingDirectoryProvider);
exports.UserWorkingDirectoryProvider = UserWorkingDirectoryProvider;
//# sourceMappingURL=user-working-directory-provider.js.map