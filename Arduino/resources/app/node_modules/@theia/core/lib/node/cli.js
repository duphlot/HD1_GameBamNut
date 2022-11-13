"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliManager = exports.CliContribution = void 0;
const yargs = require("yargs");
const inversify_1 = require("inversify");
const contribution_provider_1 = require("../common/contribution-provider");
exports.CliContribution = Symbol('CliContribution');
let CliManager = class CliManager {
    constructor(contributionsProvider) {
        this.contributionsProvider = contributionsProvider;
    }
    async initializeCli(argv) {
        const pack = require('../../package.json');
        const version = pack.version;
        const command = yargs.version(version);
        command.exitProcess(this.isExit());
        for (const contrib of this.contributionsProvider.getContributions()) {
            contrib.configure(command);
        }
        const args = command
            .detectLocale(false)
            .showHelpOnFail(false, 'Specify --help for available options')
            .help('help')
            .parse(argv);
        for (const contrib of this.contributionsProvider.getContributions()) {
            await contrib.setArguments(args);
        }
    }
    isExit() {
        return true;
    }
};
CliManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.CliContribution)),
    __metadata("design:paramtypes", [Object])
], CliManager);
exports.CliManager = CliManager;
//# sourceMappingURL=cli.js.map