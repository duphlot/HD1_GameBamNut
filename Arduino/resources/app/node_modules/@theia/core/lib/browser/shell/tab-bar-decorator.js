"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.TabBarDecoratorService = exports.TabBarDecorator = void 0;
const debounce = require("lodash.debounce");
const inversify_1 = require("inversify");
const common_1 = require("../../common");
exports.TabBarDecorator = Symbol('TabBarDecorator');
let TabBarDecoratorService = class TabBarDecoratorService {
    constructor() {
        this.onDidChangeDecorationsEmitter = new common_1.Emitter();
        this.onDidChangeDecorations = this.onDidChangeDecorationsEmitter.event;
        this.fireDidChangeDecorations = debounce(() => this.onDidChangeDecorationsEmitter.fire(undefined), 150);
    }
    initialize() {
        this.contributions.getContributions().map(decorator => decorator.onDidChangeDecorations(this.fireDidChangeDecorations));
    }
    /**
     * Assign tabs the decorators provided by all the contributions.
     * @param {Title<Widget>} title the title
     * @returns an array of its decoration data.
     */
    getDecorations(title) {
        const decorators = this.contributions.getContributions();
        let all = [];
        for (const decorator of decorators) {
            const decorations = decorator.decorate(title);
            all = all.concat(decorations);
        }
        return all;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(exports.TabBarDecorator),
    __metadata("design:type", Object)
], TabBarDecoratorService.prototype, "contributions", void 0);
TabBarDecoratorService = __decorate([
    (0, inversify_1.injectable)()
], TabBarDecoratorService);
exports.TabBarDecoratorService = TabBarDecoratorService;
//# sourceMappingURL=tab-bar-decorator.js.map