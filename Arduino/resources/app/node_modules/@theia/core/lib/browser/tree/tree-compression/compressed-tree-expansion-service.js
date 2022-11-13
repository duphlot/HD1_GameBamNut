"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.CompressedExpansionService = void 0;
const inversify_1 = require("inversify");
const tree_compression_service_1 = require("./tree-compression-service");
const tree_expansion_1 = require("../tree-expansion");
let CompressedExpansionService = class CompressedExpansionService extends tree_expansion_1.TreeExpansionServiceImpl {
    async expandNode(raw) {
        if (!this.compressionToggle.compress) {
            return super.expandNode(raw);
        }
        const participants = this.compressionService.getCompressionChain(raw);
        let expansionRoot;
        for (const node of participants !== null && participants !== void 0 ? participants : [raw]) {
            const next = await super.expandNode(node);
            expansionRoot = expansionRoot !== null && expansionRoot !== void 0 ? expansionRoot : next;
        }
        return expansionRoot;
    }
    async collapseNode(raw) {
        if (!this.compressionToggle.compress) {
            return super.collapseNode(raw);
        }
        const participants = this.compressionService.getCompressionChain(raw);
        let didCollapse = false;
        for (const participant of participants !== null && participants !== void 0 ? participants : [raw]) {
            didCollapse = await super.collapseNode(participant) || didCollapse;
        }
        return didCollapse;
    }
};
__decorate([
    (0, inversify_1.inject)(tree_compression_service_1.CompressionToggle),
    __metadata("design:type", Object)
], CompressedExpansionService.prototype, "compressionToggle", void 0);
__decorate([
    (0, inversify_1.inject)(tree_compression_service_1.TreeCompressionService),
    __metadata("design:type", tree_compression_service_1.TreeCompressionService)
], CompressedExpansionService.prototype, "compressionService", void 0);
CompressedExpansionService = __decorate([
    (0, inversify_1.injectable)()
], CompressedExpansionService);
exports.CompressedExpansionService = CompressedExpansionService;
//# sourceMappingURL=compressed-tree-expansion-service.js.map