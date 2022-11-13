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
var ApplicationShellMouseTracker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationShellMouseTracker = void 0;
const application_shell_1 = require("./application-shell");
const inversify_1 = require("inversify");
const disposable_1 = require("../../common/disposable");
const event_1 = require("../../common/event");
const widgets_1 = require("@phosphor/widgets");
const widgets_2 = require("../widgets");
/**
 * Contribution that tracks `mouseup` and `mousedown` events.
 *
 * This is required to be able to track the `TabBar`, `DockPanel`, and `SidePanel` resizing and drag and drop events correctly
 * all over the application. By default, when the mouse is over an `iframe` we lose the mouse tracking ability, so whenever
 * we click (`mousedown`), we overlay a transparent `div` over the `iframe` in the Mini Browser, then we set the `display` of
 * the transparent `div` to `none` on `mouseup` events.
 */
let ApplicationShellMouseTracker = ApplicationShellMouseTracker_1 = class ApplicationShellMouseTracker {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposeOnActiveChange = new disposable_1.DisposableCollection();
        this.mouseupEmitter = new event_1.Emitter();
        this.mousedownEmitter = new event_1.Emitter();
        this.mouseupListener = e => this.mouseupEmitter.fire(e);
        this.mousedownListener = e => this.mousedownEmitter.fire(e);
    }
    onStart() {
        // Here we need to attach a `mousedown` listener to the `TabBar`s, `DockPanel`s and the `SidePanel`s. Otherwise, Phosphor handles the event and stops the propagation.
        // Track the `mousedown` on the `TabBar` for the currently active widget.
        this.applicationShell.onDidChangeActiveWidget((args) => {
            this.toDisposeOnActiveChange.dispose();
            if (args.newValue) {
                const tabBar = this.applicationShell.getTabBarFor(args.newValue);
                if (tabBar) {
                    this.toDisposeOnActiveChange.push((0, widgets_2.addEventListener)(tabBar.node, 'mousedown', this.mousedownListener, true));
                }
            }
        });
        // Track the `mousedown` events for the `SplitPanel`s, if any.
        const { layout } = this.applicationShell;
        if (layout instanceof widgets_1.PanelLayout) {
            this.toDispose.pushAll(layout.widgets.filter(ApplicationShellMouseTracker_1.isSplitPanel).map(splitPanel => (0, widgets_2.addEventListener)(splitPanel.node, 'mousedown', this.mousedownListener, true)));
        }
        // Track the `mousedown` on each `DockPanel`.
        const { mainPanel, bottomPanel, leftPanelHandler, rightPanelHandler } = this.applicationShell;
        this.toDispose.pushAll([mainPanel, bottomPanel, leftPanelHandler.dockPanel, rightPanelHandler.dockPanel]
            .map(panel => (0, widgets_2.addEventListener)(panel.node, 'mousedown', this.mousedownListener, true)));
        // The `mouseup` event has to be tracked on the `document`. Phosphor attaches to there.
        document.addEventListener('mouseup', this.mouseupListener, true);
        // Make sure it is disposed in the end.
        this.toDispose.pushAll([
            this.mousedownEmitter,
            this.mouseupEmitter,
            disposable_1.Disposable.create(() => document.removeEventListener('mouseup', this.mouseupListener, true))
        ]);
    }
    onStop() {
        this.toDispose.dispose();
        this.toDisposeOnActiveChange.dispose();
    }
    get onMouseup() {
        return this.mouseupEmitter.event;
    }
    get onMousedown() {
        return this.mousedownEmitter.event;
    }
};
__decorate([
    (0, inversify_1.inject)(application_shell_1.ApplicationShell),
    __metadata("design:type", application_shell_1.ApplicationShell)
], ApplicationShellMouseTracker.prototype, "applicationShell", void 0);
ApplicationShellMouseTracker = ApplicationShellMouseTracker_1 = __decorate([
    (0, inversify_1.injectable)()
], ApplicationShellMouseTracker);
exports.ApplicationShellMouseTracker = ApplicationShellMouseTracker;
(function (ApplicationShellMouseTracker) {
    function isSplitPanel(arg) {
        return arg instanceof widgets_1.SplitPanel;
    }
    ApplicationShellMouseTracker.isSplitPanel = isSplitPanel;
})(ApplicationShellMouseTracker = exports.ApplicationShellMouseTracker || (exports.ApplicationShellMouseTracker = {}));
exports.ApplicationShellMouseTracker = ApplicationShellMouseTracker;
//# sourceMappingURL=application-shell-mouse-tracker.js.map