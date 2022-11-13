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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSourceNode = exports.CompositeTreeElementNode = exports.TreeElementNode = exports.SourceTree = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("inversify");
const tree_1 = require("../tree");
const tree_source_1 = require("./tree-source");
let SourceTree = class SourceTree extends tree_1.TreeImpl {
    async resolveChildren(parent) {
        const elements = await this.resolveElements(parent);
        const nodes = [];
        let index = 0;
        for (const element of elements) {
            if (element.visible !== false) {
                nodes.push(this.toNode(element, index++, parent));
            }
        }
        return nodes;
    }
    resolveElements(parent) {
        if (TreeSourceNode.is(parent)) {
            return parent.source.getElements();
        }
        return parent.element.getElements();
    }
    toNode(element, index, parent) {
        const id = element.id ? String(element.id) : (parent.id + ':' + index);
        const name = id;
        const existing = this.getNode(id);
        const updated = existing && Object.assign(existing, { element, parent });
        if (tree_source_1.CompositeTreeElement.hasElements(element)) {
            if (updated) {
                if (!tree_1.ExpandableTreeNode.is(updated)) {
                    Object.assign(updated, { expanded: false });
                }
                if (!tree_1.CompositeTreeNode.is(updated)) {
                    Object.assign(updated, { children: [] });
                }
                return updated;
            }
            return {
                element,
                parent,
                id,
                name,
                selected: false,
                expanded: false,
                children: []
            };
        }
        if (CompositeTreeElementNode.is(updated)) {
            delete updated.expanded;
            delete updated.children;
        }
        if (updated) {
            if (tree_1.ExpandableTreeNode.is(updated)) {
                delete updated.expanded;
            }
            if (tree_1.CompositeTreeNode.is(updated)) {
                delete updated.children;
            }
            return updated;
        }
        return {
            element,
            parent,
            id,
            name,
            selected: false
        };
    }
};
SourceTree = __decorate([
    (0, inversify_1.injectable)()
], SourceTree);
exports.SourceTree = SourceTree;
var TreeElementNode;
(function (TreeElementNode) {
    function is(node) {
        return tree_1.SelectableTreeNode.is(node) && 'element' in node;
    }
    TreeElementNode.is = is;
})(TreeElementNode = exports.TreeElementNode || (exports.TreeElementNode = {}));
var CompositeTreeElementNode;
(function (CompositeTreeElementNode) {
    function is(node) {
        return TreeElementNode.is(node) && tree_1.CompositeTreeNode.is(node) && tree_1.ExpandableTreeNode.is(node) && !!node.visible;
    }
    CompositeTreeElementNode.is = is;
})(CompositeTreeElementNode = exports.CompositeTreeElementNode || (exports.CompositeTreeElementNode = {}));
var TreeSourceNode;
(function (TreeSourceNode) {
    function is(node) {
        return tree_1.CompositeTreeNode.is(node) && !node.visible && 'source' in node;
    }
    TreeSourceNode.is = is;
    function to(source) {
        if (!source) {
            return source;
        }
        const id = source.id || '__source__';
        return {
            id,
            name: id,
            visible: false,
            children: [],
            source,
            parent: undefined,
            selected: false
        };
    }
    TreeSourceNode.to = to;
})(TreeSourceNode = exports.TreeSourceNode || (exports.TreeSourceNode = {}));
//# sourceMappingURL=source-tree.js.map