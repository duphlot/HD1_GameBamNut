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
exports.PreferenceConfigurations = exports.bindPreferenceConfigurations = exports.PreferenceConfiguration = void 0;
const inversify_1 = require("inversify");
const contribution_provider_1 = require("../../common/contribution-provider");
exports.PreferenceConfiguration = Symbol('PreferenceConfiguration');
function bindPreferenceConfigurations(bind) {
    (0, contribution_provider_1.bindContributionProvider)(bind, exports.PreferenceConfiguration);
    bind(PreferenceConfigurations).toSelf().inSingletonScope();
}
exports.bindPreferenceConfigurations = bindPreferenceConfigurations;
let PreferenceConfigurations = class PreferenceConfigurations {
    /* prefer Theia over VS Code by default */
    getPaths() {
        return ['.theia', '.vscode'];
    }
    getConfigName() {
        return 'settings';
    }
    getSectionNames() {
        if (!this.sectionNames) {
            this.sectionNames = this.provider.getContributions().map(p => p.name);
        }
        return this.sectionNames;
    }
    isSectionName(name) {
        return this.getSectionNames().indexOf(name) !== -1;
    }
    isAnyConfig(name) {
        return [...this.getSectionNames(), this.getConfigName()].includes(name);
    }
    isSectionUri(configUri) {
        return !!configUri && this.isSectionName(this.getName(configUri));
    }
    isConfigUri(configUri) {
        return !!configUri && this.getName(configUri) === this.getConfigName();
    }
    getName(configUri) {
        return configUri.path.name;
    }
    getPath(configUri) {
        return configUri.parent.path.base;
    }
    createUri(folder, configPath = this.getPaths()[0], configName = this.getConfigName()) {
        return folder.resolve(configPath).resolve(configName + '.json');
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.PreferenceConfiguration),
    __metadata("design:type", Object)
], PreferenceConfigurations.prototype, "provider", void 0);
PreferenceConfigurations = __decorate([
    (0, inversify_1.injectable)()
], PreferenceConfigurations);
exports.PreferenceConfigurations = PreferenceConfigurations;
//# sourceMappingURL=preference-configurations.js.map