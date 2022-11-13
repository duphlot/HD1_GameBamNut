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
var FuzzySearch_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuzzySearch = void 0;
const fuzzy = require("fuzzy");
const inversify_1 = require("inversify");
let FuzzySearch = FuzzySearch_1 = class FuzzySearch {
    /**
     * Filters the input and returns with an array that contains all items that match the pattern.
     */
    async filter(input) {
        return fuzzy.filter(input.pattern, input.items.slice(), {
            pre: FuzzySearch_1.PRE,
            post: FuzzySearch_1.POST,
            extract: input.transform
        }).sort(this.sortResults.bind(this)).map(this.mapResult.bind(this));
    }
    sortResults(left, right) {
        return left.index - right.index;
    }
    mapResult(result) {
        return {
            item: result.original,
            ranges: this.mapRanges(result.string)
        };
    }
    mapRanges(input) {
        const copy = input.split('').filter(s => s !== '');
        const ranges = [];
        const validate = (pre, post) => {
            if (preIndex > postIndex || (preIndex === -1) !== (postIndex === -1)) {
                throw new Error(`Error when trying to map ranges. Escaped string was: '${input}. [${[...input].join('|')}]'`);
            }
        };
        let preIndex = copy.indexOf(FuzzySearch_1.PRE);
        let postIndex = copy.indexOf(FuzzySearch_1.POST);
        validate(preIndex, postIndex);
        while (preIndex !== -1 && postIndex !== -1) {
            ranges.push({
                offset: preIndex,
                length: postIndex - preIndex - 1
            });
            copy.splice(postIndex, 1);
            copy.splice(preIndex, 1);
            preIndex = copy.indexOf(FuzzySearch_1.PRE);
            postIndex = copy.indexOf(FuzzySearch_1.POST);
        }
        if (ranges.length === 0) {
            throw new Error(`Unexpected zero ranges for match-string: ${input}.`);
        }
        return ranges;
    }
};
FuzzySearch.PRE = '\x01';
FuzzySearch.POST = '\x02';
FuzzySearch = FuzzySearch_1 = __decorate([
    (0, inversify_1.injectable)()
], FuzzySearch);
exports.FuzzySearch = FuzzySearch;
//# sourceMappingURL=fuzzy-search.js.map