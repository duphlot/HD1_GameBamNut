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
exports.DefaultFileIconThemeContribution = exports.IconThemeApplicationContribution = exports.IconThemeContribution = void 0;
const inversify_1 = require("inversify");
const contribution_provider_1 = require("../common/contribution-provider");
const icon_theme_service_1 = require("./icon-theme-service");
const disposable_1 = require("../common/disposable");
exports.IconThemeContribution = Symbol('IconThemeContribution');
let IconThemeApplicationContribution = class IconThemeApplicationContribution {
    async onStart() {
        for (const contribution of this.iconThemeContributions.getContributions()) {
            await contribution.registerIconThemes(this.iconThemes);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(icon_theme_service_1.IconThemeService),
    __metadata("design:type", icon_theme_service_1.IconThemeService)
], IconThemeApplicationContribution.prototype, "iconThemes", void 0);
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.IconThemeContribution),
    __metadata("design:type", Object)
], IconThemeApplicationContribution.prototype, "iconThemeContributions", void 0);
IconThemeApplicationContribution = __decorate([
    (0, inversify_1.injectable)()
], IconThemeApplicationContribution);
exports.IconThemeApplicationContribution = IconThemeApplicationContribution;
let DefaultFileIconThemeContribution = class DefaultFileIconThemeContribution {
    constructor() {
        this.id = 'theia-file-icons';
        this.label = 'File Icons (Theia)';
        this.hasFileIcons = true;
        this.hasFolderIcons = true;
    }
    registerIconThemes(iconThemes) {
        iconThemes.register(this);
    }
    /* rely on behaviour before for backward-compatibility */
    activate() {
        return disposable_1.Disposable.NULL;
    }
};
DefaultFileIconThemeContribution = __decorate([
    (0, inversify_1.injectable)()
], DefaultFileIconThemeContribution);
exports.DefaultFileIconThemeContribution = DefaultFileIconThemeContribution;
//# sourceMappingURL=icon-theme-contribution.js.map