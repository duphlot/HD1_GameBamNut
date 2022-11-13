"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.TreeCompressionService = exports.CompressionToggle = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../common/types");
const tree_1 = require("../tree");
const tree_expansion_1 = require("../tree-expansion");
exports.CompressionToggle = Symbol('CompressionToggle');
let TreeCompressionService = class TreeCompressionService {
    /**
     * @returns `true` if the node has a single child that is a CompositeTreeNode
     * In that case, the child can be shown in the same row as the parent.
     */
    isCompressionParent(node) {
        return this.isVisibleExpandableNode(node) && node.children.length === 1 && this.isVisibleExpandableNode(node.children[0]);
    }
    isVisibleExpandableNode(node) {
        return tree_expansion_1.ExpandableTreeNode.is(node) && tree_1.TreeNode.isVisible(node);
    }
    /**
     * @returns `true` if the node is a CompositeTreeNode and is its parent's sole child
     * In that case, the node can be shown in the same row as its parent.
     */
    isCompressionChild(node) {
        return this.isCompressionParent(node === null || node === void 0 ? void 0 : node.parent);
    }
    /**
     * @returns `true` if the node is a CompositeTreeNode with a sole child, and the same is not true of its parent.
     * In that case, the node will appear as the first member of a compressed row.
     */
    isCompressionHead(node) {
        return this.isCompressionParent(node) && !this.isCompressionParent(node.parent);
    }
    /**
     * @returns `true` if the node's parent is a CompositeTreeNode with a sole child, and the same is not true of the node.
     * In that case, the node will appear as the last member of a compressed row.
     */
    isCompressionTail(node) {
        return this.isCompressionChild(node) && !this.isCompressionParent(node);
    }
    /**
     * @returns `true` if the node is part of a compression row, either a {@link CompressionChild} or {@link CompressionParent}
     */
    isCompressionParticipant(node) {
        return this.isCompressionParent(node) || this.isCompressionChild(node);
    }
    getCompressedChildren(node) {
        if (this.isCompressionHead(node)) {
            const items = [];
            let next = node.children[0];
            while (this.isCompressionChild(next)) {
                items.push(next);
                next = next.children[0];
            }
            return types_1.ArrayUtils.asTail(items);
        }
    }
    /**
     * @returns The {@link CompressionHead} of the node's compression chain, or undefined if the node is not a {@link CompressionParticipant}.
     */
    getCompressionHead(node) {
        while (this.isCompressionParticipant(node)) {
            if (this.isCompressionHead(node)) {
                return node;
            }
            node = node.parent;
        }
    }
    /**
     * @returns The compression chain of which the `node` is a part, or `undefined` if the `node` is not a {@link CompressionParticipant}
     */
    getCompressionChain(node) {
        const head = this.getCompressionHead(node);
        if (head) {
            return types_1.ArrayUtils.asHeadAndTail([head].concat(this.getCompressedChildren(head)));
        }
    }
};
TreeCompressionService = __decorate([
    (0, inversify_1.injectable)()
], TreeCompressionService);
exports.TreeCompressionService = TreeCompressionService;
//# sourceMappingURL=tree-compression-service.js.map