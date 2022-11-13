"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var QuickHelpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickHelpService = void 0;
const inversify_1 = require("inversify");
const quick_access_1 = require("./quick-access");
const quick_input_service_1 = require("./quick-input-service");
let QuickHelpService = QuickHelpService_1 = class QuickHelpService {
    getPicks(filter, token) {
        const { editorProviders, globalProviders } = this.getQuickAccessProviders();
        const result = editorProviders.length === 0 || globalProviders.length === 0 ?
            // Without groups
            [
                ...(editorProviders.length === 0 ? globalProviders : editorProviders)
            ] :
            // With groups
            [
                { type: 'separator', label: 'global commands' },
                ...globalProviders,
                { type: 'separator', label: 'editor commands' },
                ...editorProviders
            ];
        return result;
    }
    getQuickAccessProviders() {
        const globalProviders = [];
        const editorProviders = [];
        const providers = this.quickAccessRegistry.getQuickAccessProviders();
        for (const provider of providers.sort((providerA, providerB) => providerA.prefix.localeCompare(providerB.prefix))) {
            if (provider.prefix === QuickHelpService_1.PREFIX) {
                continue; // exclude help which is already active
            }
            for (const helpEntry of provider.helpEntries) {
                const prefix = helpEntry.prefix || provider.prefix;
                const label = prefix || '\u2026' /* ... */;
                (helpEntry.needsEditor ? editorProviders : globalProviders).push({
                    label,
                    ariaLabel: `${label}, ${helpEntry.description}`,
                    description: helpEntry.description,
                    execute: () => this.quickInputService.open(prefix)
                });
            }
        }
        return { editorProviders, globalProviders };
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: QuickHelpService_1.PREFIX,
            placeholder: 'Type "?" to get help on the actions you can take from here.',
            helpEntries: [{ description: 'Show all Quick Access Providers', needsEditor: false }]
        });
    }
};
QuickHelpService.PREFIX = '?';
__decorate([
    (0, inversify_1.inject)(quick_access_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], QuickHelpService.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_service_1.QuickInputService),
    __metadata("design:type", Object)
], QuickHelpService.prototype, "quickInputService", void 0);
QuickHelpService = QuickHelpService_1 = __decorate([
    (0, inversify_1.injectable)()
], QuickHelpService);
exports.QuickHelpService = QuickHelpService;
//# sourceMappingURL=quick-help-service.js.map