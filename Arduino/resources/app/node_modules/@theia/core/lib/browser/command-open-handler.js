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
exports.CommandOpenHandler = void 0;
const inversify_1 = require("inversify");
const command_1 = require("../common/command");
let CommandOpenHandler = class CommandOpenHandler {
    constructor() {
        this.id = 'command';
    }
    canHandle(uri) {
        return uri.scheme === 'command' ? 500 : -1;
    }
    async open(uri) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let args = [];
        try {
            args = JSON.parse(decodeURIComponent(uri.query));
        }
        catch (_a) {
            // ignore and retry
            try {
                args = JSON.parse(uri.query);
            }
            catch (_b) {
                // ignore error
            }
        }
        if (!Array.isArray(args)) {
            args = [args];
        }
        await this.commands.executeCommand(uri.path.toString(), ...args);
        return true;
    }
};
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], CommandOpenHandler.prototype, "commands", void 0);
CommandOpenHandler = __decorate([
    (0, inversify_1.injectable)()
], CommandOpenHandler);
exports.CommandOpenHandler = CommandOpenHandler;
//# sourceMappingURL=command-open-handler.js.map