"use strict";
/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
*******************************************************************************/
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
exports.Stopwatch = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("inversify");
const logger_1 = require("../logger");
/** The default log level for measurements that are not otherwise configured with a default. */
const DEFAULT_LOG_LEVEL = logger_1.LogLevel.INFO;
/**
 * A factory of {@link Measurement}s for performance logging.
 */
let Stopwatch = class Stopwatch {
    constructor(defaultLogOptions) {
        this.defaultLogOptions = defaultLogOptions;
        if (!defaultLogOptions.defaultLogLevel) {
            defaultLogOptions.defaultLogLevel = DEFAULT_LOG_LEVEL;
        }
    }
    /**
     * Wrap an asynchronous function in a {@link Measurement} that logs itself on completion.
     * If obtaining and awaiting the `computation` runs too long according to the threshold
     * set in the `options`, then the log message is a warning, otherwise a debug log.
     *
     * @param name the {@link Measurement.name name of the measurement} to wrap around the function
     * @param description a description of what the function does, to be included in the log
     * @param computation a supplier of the asynchronous function to wrap
     * @param options optional addition configuration as for {@link measure}
     * @returns the wrapped `computation`
     *
     * @see {@link MeasurementOptions.thresholdMillis}
     */
    async startAsync(name, description, computation, options) {
        var _a;
        const threshold = (_a = options === null || options === void 0 ? void 0 : options.thresholdMillis) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
        const measure = this.start(name, options);
        const result = await computation();
        if (measure.stop() > threshold) {
            measure.warn(`${description} took longer than the expected maximum ${threshold} milliseconds`);
        }
        else {
            measure.log(description);
        }
        return result;
    }
    createMeasurement(name, measurement, options) {
        const logOptions = this.mergeLogOptions(options);
        const result = {
            name,
            stop: () => {
                if (result.elapsed === undefined) {
                    result.elapsed = measurement();
                }
                return result.elapsed;
            },
            log: (activity, ...optionalArgs) => this.log(result, activity, this.atLevel(logOptions, undefined, optionalArgs)),
            debug: (activity, ...optionalArgs) => this.log(result, activity, this.atLevel(logOptions, logger_1.LogLevel.DEBUG, optionalArgs)),
            info: (activity, ...optionalArgs) => this.log(result, activity, this.atLevel(logOptions, logger_1.LogLevel.INFO, optionalArgs)),
            warn: (activity, ...optionalArgs) => this.log(result, activity, this.atLevel(logOptions, logger_1.LogLevel.WARN, optionalArgs)),
            error: (activity, ...optionalArgs) => this.log(result, activity, this.atLevel(logOptions, logger_1.LogLevel.ERROR, optionalArgs)),
        };
        return result;
    }
    mergeLogOptions(logOptions) {
        const result = Object.assign({}, this.defaultLogOptions);
        if (logOptions) {
            Object.assign(result, logOptions);
        }
        return result;
    }
    atLevel(logOptions, levelOverride, optionalArgs) {
        return Object.assign(Object.assign({}, logOptions), { levelOverride, arguments: optionalArgs });
    }
    logLevel(elapsed, options) {
        var _a, _b;
        if (options === null || options === void 0 ? void 0 : options.levelOverride) {
            return options.levelOverride;
        }
        return (_b = (_a = options === null || options === void 0 ? void 0 : options.defaultLogLevel) !== null && _a !== void 0 ? _a : this.defaultLogOptions.defaultLogLevel) !== null && _b !== void 0 ? _b : DEFAULT_LOG_LEVEL;
    }
    log(measurement, activity, options) {
        var _a;
        const elapsed = measurement.stop();
        const level = this.logLevel(elapsed, options);
        if (Number.isNaN(elapsed)) {
            switch (level) {
                case logger_1.LogLevel.ERROR:
                case logger_1.LogLevel.FATAL:
                    // Always log errors, even if NaN duration from native API preventing a measurement
                    break;
                default:
                    // Measurement was prevented by native API, do not log NaN duration
                    return;
            }
        }
        const start = options.owner ? `${options.owner} start` : 'start';
        const timeFromStart = `Finished ${(options.now() / 1000).toFixed(3)} s after ${start}`;
        const whatWasMeasured = options.context ? `[${options.context}] ${activity}` : activity;
        this.logger.log(level, `${whatWasMeasured}: ${elapsed.toFixed(1)} ms [${timeFromStart}]`, ...((_a = options.arguments) !== null && _a !== void 0 ? _a : []));
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], Stopwatch.prototype, "logger", void 0);
Stopwatch = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], Stopwatch);
exports.Stopwatch = Stopwatch;
//# sourceMappingURL=stopwatch.js.map