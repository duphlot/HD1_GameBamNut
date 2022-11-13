"use strict";
// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
var KeytarServiceImpl_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeytarServiceImpl = void 0;
const inversify_1 = require("inversify");
const common_1 = require("../common");
const keytar = require("keytar");
let KeytarServiceImpl = KeytarServiceImpl_1 = class KeytarServiceImpl {
    async setPassword(service, account, password) {
        if (common_1.isWindows && password.length > KeytarServiceImpl_1.MAX_PASSWORD_LENGTH) {
            let index = 0;
            let chunk = 0;
            let hasNextChunk = true;
            while (hasNextChunk) {
                const passwordChunk = password.substring(index, index + KeytarServiceImpl_1.PASSWORD_CHUNK_SIZE);
                index += KeytarServiceImpl_1.PASSWORD_CHUNK_SIZE;
                hasNextChunk = password.length - index > 0;
                const content = {
                    content: passwordChunk,
                    hasNextChunk: hasNextChunk
                };
                await keytar.setPassword(service, chunk ? `${account}-${chunk}` : account, JSON.stringify(content));
                chunk++;
            }
        }
        else {
            await keytar.setPassword(service, account, password);
        }
    }
    deletePassword(service, account) {
        return keytar.deletePassword(service, account);
    }
    async getPassword(service, account) {
        const password = await keytar.getPassword(service, account);
        if (password) {
            try {
                let { content, hasNextChunk } = JSON.parse(password);
                if (!content || !hasNextChunk) {
                    return password;
                }
                let index = 1;
                while (hasNextChunk) {
                    const nextChunk = await keytar.getPassword(service, `${account}-${index++}`);
                    const result = JSON.parse(nextChunk);
                    content += result.content;
                    hasNextChunk = result.hasNextChunk;
                }
                return content;
            }
            catch (_a) {
                return password;
            }
        }
    }
    async findPassword(service) {
        const password = await keytar.findPassword(service);
        if (password) {
            return password;
        }
    }
    async findCredentials(service) {
        return keytar.findCredentials(service);
    }
};
KeytarServiceImpl.MAX_PASSWORD_LENGTH = 2500;
KeytarServiceImpl.PASSWORD_CHUNK_SIZE = KeytarServiceImpl_1.MAX_PASSWORD_LENGTH - 100;
KeytarServiceImpl = KeytarServiceImpl_1 = __decorate([
    (0, inversify_1.injectable)()
], KeytarServiceImpl);
exports.KeytarServiceImpl = KeytarServiceImpl;
//# sourceMappingURL=keytar-server.js.map