"use strict";
/********************************************************************************
 * Copyright (C) 2022 Arm and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
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
exports.SaveResourceService = void 0;
const inversify_1 = require("inversify");
const common_1 = require("../common");
const navigatable_types_1 = require("./navigatable-types");
const saveable_1 = require("./saveable");
let SaveResourceService = class SaveResourceService {
    /**
     * Indicate if the document can be saved ('Save' command should be disable if not).
     */
    canSave(widget) {
        return saveable_1.Saveable.isDirty(widget) && (this.canSaveNotSaveAs(widget) || this.canSaveAs(widget));
    }
    canSaveNotSaveAs(widget) {
        var _a;
        // By default, we never allow a document to be saved if it is untitled.
        return Boolean(widget && ((_a = navigatable_types_1.NavigatableWidget.getUri(widget)) === null || _a === void 0 ? void 0 : _a.scheme) !== common_1.UNTITLED_SCHEME);
    }
    /**
     * Saves the document
     *
     * No op if the widget is not saveable.
     */
    async save(widget, options) {
        if (this.canSaveNotSaveAs(widget)) {
            await saveable_1.Saveable.save(widget, options);
        }
        else if (this.canSaveAs(widget)) {
            await this.saveAs(widget, options);
        }
    }
    canSaveAs(saveable) {
        return false;
    }
    saveAs(sourceWidget, options) {
        return Promise.reject('Unsupported: The base SaveResourceService does not support saveAs action.');
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], SaveResourceService.prototype, "messageService", void 0);
SaveResourceService = __decorate([
    (0, inversify_1.injectable)()
], SaveResourceService);
exports.SaveResourceService = SaveResourceService;
//# sourceMappingURL=save-resource-service.js.map