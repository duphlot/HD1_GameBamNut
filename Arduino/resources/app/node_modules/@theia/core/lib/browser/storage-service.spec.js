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
const inversify_1 = require("inversify");
const window_service_1 = require("./window/window-service");
const mock_window_service_1 = require("./window/test/mock-window-service");
const storage_service_1 = require("./storage-service");
const chai_1 = require("chai");
const logger_1 = require("../common/logger");
const mock_logger_1 = require("../common/test/mock-logger");
const sinon = require("sinon");
const common_1 = require("../common/");
let storageService;
before(() => {
    const testContainer = new inversify_1.Container();
    testContainer.bind(logger_1.ILogger).toDynamicValue(ctx => {
        const logger = new mock_logger_1.MockLogger();
        /* Note this is not really needed but here we could just use the
        MockLogger since it does what we need but this is there as a demo of
        sinon for other uses-cases. We can remove this once this technique is
        more generally used. */
        sinon.stub(logger, 'warn').callsFake(async () => { });
        return logger;
    });
    testContainer.bind(storage_service_1.StorageService).to(storage_service_1.LocalStorageService).inSingletonScope();
    testContainer.bind(window_service_1.WindowService).to(mock_window_service_1.MockWindowService).inSingletonScope();
    testContainer.bind(storage_service_1.LocalStorageService).toSelf().inSingletonScope();
    testContainer.bind(common_1.MessageClient).toSelf().inSingletonScope();
    testContainer.bind(common_1.MessageService).toSelf().inSingletonScope();
    storageService = testContainer.get(storage_service_1.StorageService);
});
describe('storage-service', () => {
    it('stores data', async () => {
        storageService.setData('foo', {
            test: 'foo'
        });
        (0, chai_1.expect)(await storageService.getData('bar', 'bar')).equals('bar');
        (0, chai_1.expect)((await storageService.getData('foo', {
            test: 'bar'
        })).test).equals('foo');
    });
    it('removes data', async () => {
        storageService.setData('foo', {
            test: 'foo'
        });
        (0, chai_1.expect)((await storageService.getData('foo', {
            test: 'bar'
        })).test).equals('foo');
        storageService.setData('foo', undefined);
        (0, chai_1.expect)((await storageService.getData('foo', {
            test: 'bar'
        })).test).equals('bar');
    });
});
//# sourceMappingURL=storage-service.spec.js.map