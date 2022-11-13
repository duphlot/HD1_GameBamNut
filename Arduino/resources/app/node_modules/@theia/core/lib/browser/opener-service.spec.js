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
Object.defineProperty(exports, "__esModule", { value: true });
const opener_service_1 = require("./opener-service");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
const id = 'my-opener';
const openHandler = {
    id,
    label: 'My Opener',
    canHandle() {
        return Promise.resolve(1);
    },
    open() {
        return Promise.resolve(undefined);
    }
};
const openerService = new opener_service_1.DefaultOpenerService({
    getContributions: () => [openHandler]
});
describe('opener-service', () => {
    it('getOpeners', () => openerService.getOpeners().then(openers => {
        assert.deepStrictEqual([openHandler], openers);
    }));
    it('addHandler', () => {
        openerService.addHandler(openHandler);
        openerService.getOpeners().then(openers => {
            expect(openers.length).is.equal(2);
        });
    });
});
//# sourceMappingURL=opener-service.spec.js.map