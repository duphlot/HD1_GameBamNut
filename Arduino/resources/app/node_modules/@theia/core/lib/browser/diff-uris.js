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
exports.DiffUriLabelProviderContribution = exports.DiffUris = void 0;
const inversify_1 = require("inversify");
const uri_1 = require("../common/uri");
const label_provider_1 = require("./label-provider");
const widgets_1 = require("./widgets");
var DiffUris;
(function (DiffUris) {
    DiffUris.DIFF_SCHEME = 'diff';
    function encode(left, right, label) {
        const diffUris = [
            left.toString(),
            right.toString()
        ];
        const diffUriStr = JSON.stringify(diffUris);
        return new uri_1.default().withScheme(DiffUris.DIFF_SCHEME).withPath(label || '').withQuery(diffUriStr);
    }
    DiffUris.encode = encode;
    function decode(uri) {
        if (uri.scheme !== DiffUris.DIFF_SCHEME) {
            throw new Error((`The URI must have scheme "diff". The URI was: ${uri}.`));
        }
        const diffUris = JSON.parse(uri.query);
        return diffUris.map(s => new uri_1.default(s));
    }
    DiffUris.decode = decode;
    function isDiffUri(uri) {
        return uri.scheme === DiffUris.DIFF_SCHEME;
    }
    DiffUris.isDiffUri = isDiffUri;
})(DiffUris = exports.DiffUris || (exports.DiffUris = {}));
let DiffUriLabelProviderContribution = class DiffUriLabelProviderContribution {
    constructor(labelProvider) {
        this.labelProvider = labelProvider;
    }
    canHandle(element) {
        if (element instanceof uri_1.default && DiffUris.isDiffUri(element)) {
            return 20;
        }
        return 0;
    }
    getLongName(uri) {
        const label = uri.path.toString();
        if (label) {
            return label;
        }
        const [left, right] = DiffUris.decode(uri);
        const leftLongName = this.labelProvider.getLongName(left);
        const rightLongName = this.labelProvider.getLongName(right);
        if (leftLongName === rightLongName) {
            return leftLongName;
        }
        return `${leftLongName} ⟷ ${rightLongName}`;
    }
    getName(uri) {
        const label = uri.path.toString();
        if (label) {
            return label;
        }
        const [left, right] = DiffUris.decode(uri);
        if (left.path.toString() === right.path.toString() && left.query && right.query) {
            const prefix = left.displayName ? `${left.displayName}: ` : '';
            return `${prefix}${left.query} ⟷ ${right.query}`;
        }
        else {
            let title;
            if (uri.displayName && left.path.toString() !== right.path.toString() && left.displayName !== uri.displayName) {
                title = `${uri.displayName}: `;
            }
            else {
                title = '';
            }
            const leftLongName = this.labelProvider.getName(left);
            const rightLongName = this.labelProvider.getName(right);
            if (leftLongName === rightLongName) {
                return leftLongName;
            }
            return `${title}${leftLongName} ⟷ ${rightLongName}`;
        }
    }
    getIcon(uri) {
        return (0, widgets_1.codicon)('split-horizontal');
    }
    affects(diffUri, event) {
        for (const uri of DiffUris.decode(diffUri)) {
            if (event.affects(uri)) {
                return true;
            }
        }
        return false;
    }
};
DiffUriLabelProviderContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(label_provider_1.LabelProvider)),
    __metadata("design:paramtypes", [label_provider_1.LabelProvider])
], DiffUriLabelProviderContribution);
exports.DiffUriLabelProviderContribution = DiffUriLabelProviderContribution;
//# sourceMappingURL=diff-uris.js.map