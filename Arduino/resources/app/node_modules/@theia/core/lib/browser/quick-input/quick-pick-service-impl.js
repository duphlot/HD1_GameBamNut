"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.QuickPickServiceImpl = void 0;
const inversify_1 = require("inversify");
const event_1 = require("../../common/event");
const quick_input_service_1 = require("./quick-input-service");
let QuickPickServiceImpl = class QuickPickServiceImpl {
    constructor() {
        this.onDidHideEmitter = new event_1.Emitter();
        this.onDidHide = this.onDidHideEmitter.event;
        this.onDidChangeValueEmitter = new event_1.Emitter();
        this.onDidChangeValue = this.onDidChangeValueEmitter.event;
        this.onDidAcceptEmitter = new event_1.Emitter();
        this.onDidAccept = this.onDidAcceptEmitter.event;
        this.onDidChangeActiveEmitter = new event_1.Emitter();
        this.onDidChangeActive = this.onDidChangeActiveEmitter.event;
        this.onDidChangeSelectionEmitter = new event_1.Emitter();
        this.onDidChangeSelection = this.onDidChangeSelectionEmitter.event;
        this.onDidTriggerButtonEmitter = new event_1.Emitter();
        this.onDidTriggerButton = this.onDidTriggerButtonEmitter.event;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.items = [];
    }
    async show(items, options) {
        var _a;
        this.items = items;
        const opts = Object.assign({}, options, {
            onDidAccept: () => this.onDidAcceptEmitter.fire(),
            onDidChangeActive: (quickPick, activeItems) => this.onDidChangeActiveEmitter.fire({ quickPick, activeItems }),
            onDidChangeSelection: (quickPick, selectedItems) => this.onDidChangeSelectionEmitter.fire({ quickPick, selectedItems }),
            onDidChangeValue: (quickPick, filter) => this.onDidChangeValueEmitter.fire({ quickPick, filter }),
            onDidHide: () => this.onDidHideEmitter.fire(),
            onDidTriggerButton: (btn) => this.onDidTriggerButtonEmitter.fire(btn),
        });
        return (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, opts);
    }
    hide() {
        var _a;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.hide();
    }
    setItems(items) {
        this.items = items;
    }
};
__decorate([
    (0, inversify_1.inject)(quick_input_service_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], QuickPickServiceImpl.prototype, "quickInputService", void 0);
QuickPickServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], QuickPickServiceImpl);
exports.QuickPickServiceImpl = QuickPickServiceImpl;
//# sourceMappingURL=quick-pick-service-impl.js.map