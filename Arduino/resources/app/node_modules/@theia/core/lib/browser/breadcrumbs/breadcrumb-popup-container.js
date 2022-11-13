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
exports.BreadcrumbPopupContainer = exports.BreadcrumbID = exports.BreadcrumbPopupContainerFactory = void 0;
const inversify_1 = require("../../../shared/inversify");
const common_1 = require("../../common");
const disposable_1 = require("../../common/disposable");
const context_menu_renderer_1 = require("../context-menu-renderer");
const react_renderer_1 = require("../widgets/react-renderer");
const breadcrumbs_constants_1 = require("./breadcrumbs-constants");
exports.BreadcrumbPopupContainerFactory = Symbol('BreadcrumbPopupContainerFactory');
exports.BreadcrumbID = Symbol('BreadcrumbID');
/**
 * This class creates a popup container at the given position
 * so that contributions can attach their HTML elements
 * as children of `BreadcrumbPopupContainer#container`.
 *
 * - `dispose()` is called on blur or on hit on escape
 */
let BreadcrumbPopupContainer = class BreadcrumbPopupContainer {
    constructor() {
        this.onDidDisposeEmitter = new common_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection(this.onDidDisposeEmitter);
        this.onFocusOut = (event) => {
            if (!(event.relatedTarget instanceof Element) || !this._container.contains(event.relatedTarget)) {
                this.dispose();
            }
        };
        this.escFunction = (event) => {
            if (event.key === 'Escape' || event.key === 'Esc') {
                this.dispose();
            }
        };
    }
    get onDidDispose() {
        return this.onDidDisposeEmitter.event;
    }
    get container() {
        return this._container;
    }
    get isOpen() {
        return this._isOpen;
    }
    init() {
        this._container = this.createPopupDiv(this.position);
        document.addEventListener('keyup', this.escFunction);
        this._container.focus();
        this._isOpen = true;
    }
    createPopupDiv(position) {
        const result = window.document.createElement('div');
        result.className = breadcrumbs_constants_1.Styles.BREADCRUMB_POPUP;
        result.style.left = `${position.x}px`;
        result.style.top = `${position.y}px`;
        result.tabIndex = 0;
        result.addEventListener('focusout', this.onFocusOut);
        this.parent.appendChild(result);
        return result;
    }
    dispose() {
        if (!this.toDispose.disposed) {
            this.onDidDisposeEmitter.fire();
            this.toDispose.dispose();
            this._container.remove();
            this._isOpen = false;
            document.removeEventListener('keyup', this.escFunction);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(react_renderer_1.RendererHost),
    __metadata("design:type", Object)
], BreadcrumbPopupContainer.prototype, "parent", void 0);
__decorate([
    (0, inversify_1.inject)(exports.BreadcrumbID),
    __metadata("design:type", String)
], BreadcrumbPopupContainer.prototype, "breadcrumbId", void 0);
__decorate([
    (0, inversify_1.inject)(context_menu_renderer_1.Coordinate),
    __metadata("design:type", Object)
], BreadcrumbPopupContainer.prototype, "position", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BreadcrumbPopupContainer.prototype, "init", null);
BreadcrumbPopupContainer = __decorate([
    (0, inversify_1.injectable)()
], BreadcrumbPopupContainer);
exports.BreadcrumbPopupContainer = BreadcrumbPopupContainer;
//# sourceMappingURL=breadcrumb-popup-container.js.map