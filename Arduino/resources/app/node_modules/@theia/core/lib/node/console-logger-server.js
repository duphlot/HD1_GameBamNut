"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.ConsoleLoggerServer = void 0;
const inversify_1 = require("inversify");
const logger_watcher_1 = require("../common/logger-watcher");
const logger_cli_contribution_1 = require("./logger-cli-contribution");
const logger_protocol_1 = require("../common/logger-protocol");
let ConsoleLoggerServer = class ConsoleLoggerServer {
    constructor() {
        this.client = undefined;
    }
    init() {
        for (const name of Object.keys(this.cli.logLevels)) {
            this.setLogLevel(name, this.cli.logLevels[name]);
        }
    }
    async setLogLevel(name, newLogLevel) {
        const event = {
            loggerName: name,
            newLogLevel
        };
        if (this.client !== undefined) {
            this.client.onLogLevelChanged(event);
        }
        this.watcher.fireLogLevelChanged(event);
    }
    async getLogLevel(name) {
        return this.cli.logLevelFor(name);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async log(name, logLevel, message, params) {
        const configuredLogLevel = await this.getLogLevel(name);
        if (logLevel >= configuredLogLevel) {
            logger_protocol_1.ConsoleLogger.log(name, logLevel, message, params);
        }
    }
    async child(name) {
        this.setLogLevel(name, this.cli.logLevelFor(name));
    }
    dispose() { }
    setClient(client) {
        this.client = client;
    }
};
__decorate([
    (0, inversify_1.inject)(logger_watcher_1.LoggerWatcher),
    __metadata("design:type", logger_watcher_1.LoggerWatcher)
], ConsoleLoggerServer.prototype, "watcher", void 0);
__decorate([
    (0, inversify_1.inject)(logger_cli_contribution_1.LogLevelCliContribution),
    __metadata("design:type", logger_cli_contribution_1.LogLevelCliContribution)
], ConsoleLoggerServer.prototype, "cli", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsoleLoggerServer.prototype, "init", null);
ConsoleLoggerServer = __decorate([
    (0, inversify_1.injectable)()
], ConsoleLoggerServer);
exports.ConsoleLoggerServer = ConsoleLoggerServer;
//# sourceMappingURL=console-logger-server.js.map