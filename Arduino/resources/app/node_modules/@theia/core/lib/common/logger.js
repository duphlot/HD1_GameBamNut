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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.ILogger = exports.LoggerName = exports.LoggerFactory = exports.setRootLogger = exports.unsetRootLogger = exports.logger = exports.rootLoggerName = exports.LogLevel = void 0;
const inversify_1 = require("inversify");
const logger_watcher_1 = require("./logger-watcher");
const logger_protocol_1 = require("./logger-protocol");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_protocol_1.LogLevel; } });
Object.defineProperty(exports, "rootLoggerName", { enumerable: true, get: function () { return logger_protocol_1.rootLoggerName; } });
/**
 * Counterpart of the `#setRootLogger(ILogger)`. Restores the `console.xxx` bindings to the original one.
 * Invoking has no side-effect if `setRootLogger` was not called before. Multiple function invocation has
 * no side-effect either.
 */
function unsetRootLogger() {
    if (exports.logger !== undefined) {
        logger_protocol_1.ConsoleLogger.reset();
        exports.logger = undefined;
    }
}
exports.unsetRootLogger = unsetRootLogger;
function setRootLogger(aLogger) {
    exports.logger = aLogger;
    const log = (logLevel, message, ...optionalParams) => exports.logger.log(logLevel, message, ...optionalParams);
    console.error = log.bind(undefined, logger_protocol_1.LogLevel.ERROR);
    console.warn = log.bind(undefined, logger_protocol_1.LogLevel.WARN);
    console.info = log.bind(undefined, logger_protocol_1.LogLevel.INFO);
    console.debug = log.bind(undefined, logger_protocol_1.LogLevel.DEBUG);
    console.trace = log.bind(undefined, logger_protocol_1.LogLevel.TRACE);
    console.log = log.bind(undefined, logger_protocol_1.LogLevel.INFO);
}
exports.setRootLogger = setRootLogger;
exports.LoggerFactory = Symbol('LoggerFactory');
exports.LoggerName = Symbol('LoggerName');
exports.ILogger = Symbol('ILogger');
let Logger = class Logger {
    /**
     * Build a new Logger.
     */
    constructor(server, loggerWatcher, factory, name) {
        this.server = server;
        this.loggerWatcher = loggerWatcher;
        this.factory = factory;
        this.name = name;
        if (name !== logger_protocol_1.rootLoggerName) {
            /* Creating a child logger.  */
            this.created = server.child(name);
        }
        else {
            /* Creating the root logger (it already exists at startup).  */
            this.created = Promise.resolve();
        }
        /* Fetch the log level so it's cached in the frontend.  */
        this._logLevel = this.created.then(_ => this.server.getLogLevel(name));
        /* Update the log level if it changes in the backend. */
        loggerWatcher.onLogLevelChanged(event => {
            this.created.then(() => {
                if (event.loggerName === name) {
                    this._logLevel = Promise.resolve(event.newLogLevel);
                }
            });
        });
    }
    setLogLevel(logLevel) {
        return new Promise(resolve => {
            this.created.then(() => {
                this._logLevel.then(oldLevel => {
                    this.server.setLogLevel(this.name, logLevel).then(() => {
                        this._logLevel = Promise.resolve(logLevel);
                        resolve();
                    });
                });
            });
        });
    }
    getLogLevel() {
        return this._logLevel;
    }
    isEnabled(logLevel) {
        return this._logLevel.then(level => logLevel >= level);
    }
    ifEnabled(logLevel) {
        return new Promise(resolve => this.isEnabled(logLevel).then(enabled => {
            if (enabled) {
                resolve();
            }
        }));
    }
    log(logLevel, arg2, ...params) {
        return this.getLog(logLevel).then(log => {
            if (typeof arg2 === 'function') {
                const loggable = arg2;
                loggable(log);
            }
            else if (arg2) {
                log(arg2, ...params);
            }
        });
    }
    getLog(logLevel) {
        return this.ifEnabled(logLevel).then(() => this.created.then(() => (message, ...params) => this.server.log(this.name, logLevel, this.format(message), params.map(p => this.format(p)))));
    }
    format(value) {
        if (value instanceof Error) {
            return value.stack || value.toString();
        }
        return value;
    }
    isTrace() {
        return this.isEnabled(logger_protocol_1.LogLevel.TRACE);
    }
    ifTrace() {
        return this.ifEnabled(logger_protocol_1.LogLevel.TRACE);
    }
    trace(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.TRACE, arg, ...params);
    }
    isDebug() {
        return this.isEnabled(logger_protocol_1.LogLevel.DEBUG);
    }
    ifDebug() {
        return this.ifEnabled(logger_protocol_1.LogLevel.DEBUG);
    }
    debug(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.DEBUG, arg, ...params);
    }
    isInfo() {
        return this.isEnabled(logger_protocol_1.LogLevel.INFO);
    }
    ifInfo() {
        return this.ifEnabled(logger_protocol_1.LogLevel.INFO);
    }
    info(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.INFO, arg, ...params);
    }
    isWarn() {
        return this.isEnabled(logger_protocol_1.LogLevel.WARN);
    }
    ifWarn() {
        return this.ifEnabled(logger_protocol_1.LogLevel.WARN);
    }
    warn(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.WARN, arg, ...params);
    }
    isError() {
        return this.isEnabled(logger_protocol_1.LogLevel.ERROR);
    }
    ifError() {
        return this.ifEnabled(logger_protocol_1.LogLevel.ERROR);
    }
    error(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.ERROR, arg, ...params);
    }
    isFatal() {
        return this.isEnabled(logger_protocol_1.LogLevel.FATAL);
    }
    ifFatal() {
        return this.ifEnabled(logger_protocol_1.LogLevel.FATAL);
    }
    fatal(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.FATAL, arg, ...params);
    }
    child(name) {
        return this.factory(name);
    }
};
Logger = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(logger_protocol_1.ILoggerServer)),
    __param(1, (0, inversify_1.inject)(logger_watcher_1.LoggerWatcher)),
    __param(2, (0, inversify_1.inject)(exports.LoggerFactory)),
    __param(3, (0, inversify_1.inject)(exports.LoggerName)),
    __metadata("design:paramtypes", [Object, logger_watcher_1.LoggerWatcher, Function, String])
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map