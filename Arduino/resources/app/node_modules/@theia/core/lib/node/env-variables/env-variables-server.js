"use strict";
// *****************************************************************************
// Copyright (C) 2018-2020 Red Hat, Inc. and others.
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
exports.EnvVariablesServerImpl = void 0;
const path_1 = require("path");
const os_1 = require("os");
const inversify_1 = require("inversify");
const drivelist = require("drivelist");
const os_2 = require("../../common/os");
const file_uri_1 = require("../file-uri");
let EnvVariablesServerImpl = class EnvVariablesServerImpl {
    constructor() {
        this.envs = {};
        this.homeDirUri = file_uri_1.FileUri.create((0, os_1.homedir)()).toString();
        this.configDirUri = this.createConfigDirUri();
        this.configDirUri.then(configDirUri => console.log(`Configuration directory URI: '${configDirUri}'`));
        const prEnv = process.env;
        Object.keys(prEnv).forEach((key) => {
            let keyName = key;
            if (os_2.isWindows) {
                keyName = key.toLowerCase();
            }
            this.envs[keyName] = { 'name': keyName, 'value': prEnv[key] };
        });
    }
    async createConfigDirUri() {
        return file_uri_1.FileUri.create(process.env.THEIA_CONFIG_DIR || (0, path_1.join)((0, os_1.homedir)(), '.theia')).toString();
    }
    async getExecPath() {
        return process.execPath;
    }
    async getVariables() {
        return Object.keys(this.envs).map(key => this.envs[key]);
    }
    async getValue(key) {
        if (os_2.isWindows) {
            key = key.toLowerCase();
        }
        return this.envs[key];
    }
    getConfigDirUri() {
        return this.configDirUri;
    }
    async getHomeDirUri() {
        return this.homeDirUri;
    }
    async getDrives() {
        const uris = [];
        const drives = await drivelist.list();
        for (const drive of drives) {
            for (const mountpoint of drive.mountpoints) {
                if (this.filterHiddenPartitions(mountpoint.path)) {
                    uris.push(file_uri_1.FileUri.create(mountpoint.path).toString());
                }
            }
        }
        return uris;
    }
    /**
     * Filters hidden and system partitions.
     */
    filterHiddenPartitions(path) {
        // OS X: This is your sleep-image. When your Mac goes to sleep it writes the contents of its memory to the hard disk. (https://bit.ly/2R6cztl)
        if (path === '/private/var/vm') {
            return false;
        }
        // Ubuntu: This system partition is simply the boot partition created when the computers mother board runs UEFI rather than BIOS. (https://bit.ly/2N5duHr)
        if (path === '/boot/efi') {
            return false;
        }
        return true;
    }
};
EnvVariablesServerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], EnvVariablesServerImpl);
exports.EnvVariablesServerImpl = EnvVariablesServerImpl;
//# sourceMappingURL=env-variables-server.js.map