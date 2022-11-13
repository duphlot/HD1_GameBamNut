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
exports.WidgetOpenHandler = void 0;
const inversify_1 = require("inversify");
const common_1 = require("../common");
const shell_1 = require("./shell");
const widget_manager_1 = require("./widget-manager");
/**
 * Generic base class for {@link OpenHandler}s that are opening a widget for a given {@link URI}.
 */
let WidgetOpenHandler = class WidgetOpenHandler {
    constructor() {
        this.onCreatedEmitter = new common_1.Emitter();
        /**
         * Emit when a new widget is created.
         */
        this.onCreated = this.onCreatedEmitter.event;
    }
    init() {
        this.widgetManager.onDidCreateWidget(({ factoryId, widget }) => {
            if (factoryId === this.id) {
                this.onCreatedEmitter.fire(widget);
            }
        });
    }
    /**
     * Open a widget for the given uri and options.
     * Reject if the given options are not widget options or a widget cannot be opened.
     * @param uri the uri of the resource that should be opened.
     * @param options the widget opener options.
     *
     * @returns promise of the widget that resolves when the widget has been opened.
     */
    async open(uri, options) {
        const widget = await this.getOrCreateWidget(uri, options);
        await this.doOpen(widget, options);
        return widget;
    }
    async doOpen(widget, options) {
        const op = Object.assign({ mode: 'activate' }, options);
        if (!widget.isAttached) {
            this.shell.addWidget(widget, op.widgetOptions || { area: 'main' });
        }
        if (op.mode === 'activate') {
            await this.shell.activateWidget(widget.id);
        }
        else if (op.mode === 'reveal') {
            await this.shell.revealWidget(widget.id);
        }
    }
    /**
     * Tries to get an existing widget for the given uri.
     * @param uri the uri of the widget.
     *
     * @returns a promise that resolves to the existing widget or `undefined` if no widget for the given uri exists.
     */
    getByUri(uri) {
        return this.getWidget(uri);
    }
    /**
     * Return an existing widget for the given uri or creates a new one.
     *
     * It does not open a widget, use {@link WidgetOpenHandler#open} instead.
     * @param uri uri of the widget.
     *
     * @returns a promise of the existing or newly created widget.
     */
    getOrCreateByUri(uri) {
        return this.getOrCreateWidget(uri);
    }
    /**
     * Retrieves all open widgets that have been opened by this handler.
     *
     * @returns all open widgets for this open handler.
     */
    get all() {
        return this.widgetManager.getWidgets(this.id);
    }
    tryGetPendingWidget(uri, options) {
        const factoryOptions = this.createWidgetOptions(uri, options);
        return this.widgetManager.tryGetPendingWidget(this.id, factoryOptions);
    }
    getWidget(uri, options) {
        const widgetOptions = this.createWidgetOptions(uri, options);
        return this.widgetManager.getWidget(this.id, widgetOptions);
    }
    getOrCreateWidget(uri, options) {
        const widgetOptions = this.createWidgetOptions(uri, options);
        return this.widgetManager.getOrCreateWidget(this.id, widgetOptions);
    }
    /**
     * Closes all widgets that have been opened by this open handler.
     * @param options the close options that should be applied to all widgets.
     *
     * @returns a promise of all closed widgets that resolves after they have been closed.
     */
    async closeAll(options) {
        return this.shell.closeMany(this.all, options);
    }
};
__decorate([
    (0, inversify_1.inject)(shell_1.ApplicationShell),
    __metadata("design:type", shell_1.ApplicationShell)
], WidgetOpenHandler.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(widget_manager_1.WidgetManager),
    __metadata("design:type", widget_manager_1.WidgetManager)
], WidgetOpenHandler.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WidgetOpenHandler.prototype, "init", null);
WidgetOpenHandler = __decorate([
    (0, inversify_1.injectable)()
], WidgetOpenHandler);
exports.WidgetOpenHandler = WidgetOpenHandler;
//# sourceMappingURL=widget-open-handler.js.map