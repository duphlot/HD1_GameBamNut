"use strict";
// *****************************************************************************
// Copyright (C) 2020 SAP SE or an SAP affiliate company and others.
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
exports.TreeViewWelcomeWidget = void 0;
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
// some code is copied and modified from: https://github.com/microsoft/vscode/blob/573e5145ae3b50523925a6f6315d373e649d1b06/src/vs/base/common/linkedText.ts
const React = require("react");
const inversify_1 = require("inversify");
const common_1 = require("../../common");
const context_key_service_1 = require("../context-key-service");
const tree_widget_1 = require("./tree-widget");
const window_service_1 = require("../window/window-service");
let TreeViewWelcomeWidget = class TreeViewWelcomeWidget extends tree_widget_1.TreeWidget {
    constructor() {
        super(...arguments);
        this.viewWelcomeNodes = [];
        this.items = [];
        this.openLinkOrCommand = (event, href) => {
            event.stopPropagation();
            if (href.startsWith('command:')) {
                const command = href.replace('command:', '');
                this.commands.executeCommand(command);
            }
            else {
                this.windowService.openNewWindow(href, { external: true });
            }
        };
    }
    get visibleItems() {
        const visibleItems = this.items.filter(v => v.visible);
        if (visibleItems.length && this.defaultItem) {
            return [this.defaultItem.welcomeInfo];
        }
        return visibleItems.map(v => v.welcomeInfo);
    }
    renderTree(model) {
        if (this.shouldShowWelcomeView() && this.visibleItems.length) {
            return this.renderViewWelcome();
        }
        return super.renderTree(model);
    }
    shouldShowWelcomeView() {
        return false;
    }
    renderViewWelcome() {
        return (React.createElement("div", { className: 'theia-WelcomeView' }, ...this.viewWelcomeNodes));
    }
    handleViewWelcomeContentChange(viewWelcomes) {
        this.items = [];
        for (const welcomeInfo of viewWelcomes) {
            if (welcomeInfo.when === 'default') {
                this.defaultItem = { welcomeInfo, visible: true };
            }
            else {
                const visible = welcomeInfo.when === undefined || this.contextService.match(welcomeInfo.when);
                this.items.push({ welcomeInfo, visible });
            }
        }
        this.updateViewWelcomeNodes();
        this.update();
    }
    handleWelcomeContextChange() {
        let didChange = false;
        for (const item of this.items) {
            if (!item.welcomeInfo.when || item.welcomeInfo.when === 'default') {
                continue;
            }
            const visible = item.welcomeInfo.when === undefined || this.contextService.match(item.welcomeInfo.when);
            if (item.visible === visible) {
                continue;
            }
            item.visible = visible;
            didChange = true;
        }
        if (didChange) {
            this.updateViewWelcomeNodes();
            this.update();
        }
    }
    updateViewWelcomeNodes() {
        this.viewWelcomeNodes = [];
        const items = this.visibleItems.sort((a, b) => a.order - b.order);
        for (const [iIndex, { content }] of items.entries()) {
            const lines = content.split('\n');
            for (let [lIndex, line] of lines.entries()) {
                const lineKey = `${iIndex}-${lIndex}`;
                line = line.trim();
                if (!line) {
                    continue;
                }
                const linkedTextItems = this.parseLinkedText(line);
                if (linkedTextItems.length === 1 && typeof linkedTextItems[0] !== 'string') {
                    this.viewWelcomeNodes.push(this.renderButtonNode(linkedTextItems[0], lineKey));
                }
                else {
                    const linkedTextNodes = [];
                    for (const [nIndex, node] of linkedTextItems.entries()) {
                        const linkedTextKey = `${lineKey}-${nIndex}`;
                        if (typeof node === 'string') {
                            linkedTextNodes.push(this.renderTextNode(node, linkedTextKey));
                        }
                        else {
                            linkedTextNodes.push(this.renderCommandLinkNode(node, linkedTextKey));
                        }
                    }
                    this.viewWelcomeNodes.push(React.createElement("div", { key: `line-${lineKey}` }, ...linkedTextNodes));
                }
            }
        }
    }
    renderButtonNode(node, lineKey) {
        return (React.createElement("div", { key: `line-${lineKey}`, className: 'theia-WelcomeViewButtonWrapper' },
            React.createElement("button", { title: node.title, className: 'theia-button theia-WelcomeViewButton', disabled: !this.isEnabledClick(node.href), onClick: e => this.openLinkOrCommand(e, node.href) }, node.label)));
    }
    renderTextNode(node, textKey) {
        return React.createElement("span", { key: `text-${textKey}` }, node);
    }
    renderCommandLinkNode(node, linkKey) {
        return (React.createElement("a", { key: `link-${linkKey}`, className: this.getLinkClassName(node.href), title: node.title || '', onClick: e => this.openLinkOrCommand(e, node.href) }, node.label));
    }
    getLinkClassName(href) {
        const classNames = ['theia-WelcomeViewCommandLink'];
        if (!this.isEnabledClick(href)) {
            classNames.push('disabled');
        }
        return classNames.join(' ');
    }
    isEnabledClick(href) {
        if (href.startsWith('command:')) {
            const command = href.replace('command:', '');
            return this.commands.isEnabled(command);
        }
        return true;
    }
    parseLinkedText(text) {
        const result = [];
        const linkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|command:)[^\)\s]+)(?: ("|')([^\3]+)(\3))?\)/gi;
        let index = 0;
        let match;
        while (match = linkRegex.exec(text)) {
            if (match.index - index > 0) {
                result.push(text.substring(index, match.index));
            }
            const [, label, href, , title] = match;
            if (title) {
                result.push({ label, href, title });
            }
            else {
                result.push({ label, href });
            }
            index = match.index + match[0].length;
        }
        if (index < text.length) {
            result.push(text.substring(index));
        }
        return result;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], TreeViewWelcomeWidget.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TreeViewWelcomeWidget.prototype, "contextService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], TreeViewWelcomeWidget.prototype, "windowService", void 0);
TreeViewWelcomeWidget = __decorate([
    (0, inversify_1.injectable)()
], TreeViewWelcomeWidget);
exports.TreeViewWelcomeWidget = TreeViewWelcomeWidget;
//# sourceMappingURL=tree-view-welcome-widget.js.map