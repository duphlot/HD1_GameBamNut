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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevelCliContribution = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../common/logger");
const fs = require("fs-extra");
const nsfw = require("nsfw");
const event_1 = require("../common/event");
const path = require("path");
/**
 * Parses command line switches related to log levels, then watches the log
 * levels file (if specified) for changes.  This is the source of truth for
 * what the log level per logger should be.
 */
let LogLevelCliContribution = class LogLevelCliContribution {
    constructor() {
        this._logLevels = {};
        /**
         * Log level to use for loggers not specified in `logLevels`.
         */
        this._defaultLogLevel = logger_1.LogLevel.INFO;
        this.logConfigChangedEvent = new event_1.Emitter();
    }
    get defaultLogLevel() {
        return this._defaultLogLevel;
    }
    get logLevels() {
        return this._logLevels;
    }
    configure(conf) {
        conf.option('log-level', {
            description: 'Sets the default log level',
            choices: Array.from(logger_1.LogLevel.strings.values()),
            nargs: 1,
        });
        conf.option('log-config', {
            description: 'Path to the JSON file specifying the configuration of various loggers',
            type: 'string',
            nargs: 1,
        });
    }
    async setArguments(args) {
        if (args['log-level'] !== undefined && args['log-config'] !== undefined) {
            throw new Error('--log-level and --log-config are mutually exclusive.');
        }
        if (args['log-level'] !== undefined) {
            this._defaultLogLevel = this.readLogLevelString(args['log-level'], 'Unknown log level passed to --log-level');
        }
        if (args['log-config'] !== undefined) {
            let filename = args['log-config'];
            try {
                filename = path.resolve(filename);
                await this.slurpLogConfigFile(filename);
                await this.watchLogConfigFile(filename);
            }
            catch (e) {
                console.error(`Error reading log config file ${filename}: ${e}`);
            }
        }
    }
    watchLogConfigFile(filename) {
        return nsfw(filename, async (events) => {
            try {
                for (const event of events) {
                    switch (event.action) {
                        case 0 /* CREATED */:
                        case 2 /* MODIFIED */:
                            await this.slurpLogConfigFile(filename);
                            this.logConfigChangedEvent.fire(undefined);
                            break;
                    }
                }
            }
            catch (e) {
                console.error(`Error reading log config file ${filename}: ${e}`);
            }
        }).then((watcher) => {
            watcher.start();
        });
    }
    async slurpLogConfigFile(filename) {
        try {
            const content = await fs.readFile(filename, 'utf-8');
            const data = JSON.parse(content);
            let newDefaultLogLevel = logger_1.LogLevel.INFO;
            if ('defaultLevel' in data) {
                newDefaultLogLevel = this.readLogLevelString(data['defaultLevel'], `Unknown default log level in ${filename}`);
            }
            const newLogLevels = {};
            if ('levels' in data) {
                const loggers = data['levels'];
                for (const logger of Object.keys(loggers)) {
                    const levelStr = loggers[logger];
                    newLogLevels[logger] = this.readLogLevelString(levelStr, `Unknown log level for logger ${logger} in ${filename}`);
                }
            }
            this._defaultLogLevel = newDefaultLogLevel;
            this._logLevels = newLogLevels;
            console.log(`Successfully read new log config from ${filename}.`);
        }
        catch (e) {
            throw new Error(`Error reading log config file ${filename}: ${e.message}`);
        }
    }
    get onLogConfigChanged() {
        return this.logConfigChangedEvent.event;
    }
    logLevelFor(loggerName) {
        const level = this._logLevels[loggerName];
        if (level !== undefined) {
            return level;
        }
        else {
            return this.defaultLogLevel;
        }
    }
    /**
     * Converts the string to a `LogLevel`. Throws an error if invalid.
     */
    readLogLevelString(levelStr, errMessagePrefix) {
        const level = logger_1.LogLevel.fromString(levelStr);
        if (level === undefined) {
            throw new Error(`${errMessagePrefix}: "${levelStr}".`);
        }
        return level;
    }
};
LogLevelCliContribution = __decorate([
    (0, inversify_1.injectable)()
], LogLevelCliContribution);
exports.LogLevelCliContribution = LogLevelCliContribution;
//# sourceMappingURL=logger-cli-contribution.js.map