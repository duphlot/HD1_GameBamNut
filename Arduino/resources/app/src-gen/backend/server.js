// @ts-check
require('reflect-metadata');

// Patch electron version if missing, see https://github.com/eclipse-theia/theia/pull/7361#pullrequestreview-377065146
if (typeof process.versions.electron === 'undefined' && typeof process.env.THEIA_ELECTRON_VERSION === 'string') {
    process.versions.electron = process.env.THEIA_ELECTRON_VERSION;
}

// Erase the ELECTRON_RUN_AS_NODE variable from the environment, else Electron apps started using Theia will pick it up.
if ('ELECTRON_RUN_AS_NODE' in process.env) {
    delete process.env.ELECTRON_RUN_AS_NODE;
}

const path = require('path');
const express = require('express');
const { Container } = require('inversify');
const { BackendApplication, BackendApplicationServer, CliManager } = require('@theia/core/lib/node');
const { backendApplicationModule } = require('@theia/core/lib/node/backend-application-module');
const { messagingBackendModule } = require('@theia/core/lib/node/messaging/messaging-backend-module');
const { loggerBackendModule } = require('@theia/core/lib/node/logger-backend-module');

const container = new Container();
container.load(backendApplicationModule);
container.load(messagingBackendModule);
container.load(loggerBackendModule);

function defaultServeStatic(app) {
    app.use(express.static(path.resolve(__dirname, '../../lib')))
}

function load(raw) {
    return Promise.resolve(raw.default).then(
        module => container.load(module)
    );
}

function start(port, host, argv = process.argv) {
    if (!container.isBound(BackendApplicationServer)) {
        container.bind(BackendApplicationServer).toConstantValue({ configure: defaultServeStatic });
    }
    return container.get(CliManager).initializeCli(argv).then(() => {
        return container.get(BackendApplication).start(port, host);
    });
}

module.exports = (port, host, argv) => Promise.resolve()
    .then(function () { return Promise.resolve(require('@theia/core/lib/node/i18n/i18n-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/keyboard/electron-backend-keyboard-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/token/electron-token-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/hosting/electron-backend-hosting-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/node/filesystem-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/node/download/file-download-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/workspace/lib/node/workspace-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/common/process-common-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/node/process-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/terminal/lib/node/terminal-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/task/lib/node/task-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/debug/lib/node/debug-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/file-search/lib/node/file-search-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/search-in-workspace/lib/node/search-in-workspace-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-backend-electron-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext-vscode/lib/node/plugin-vscode-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('arduino-ide-extension/lib/node/arduino-ide-backend-module')).then(load) })
    .then(() => start(port, host, argv)).catch(error => {
        console.error('Failed to start the backend application:');
        console.error(error);
        process.exitCode = 1;
        throw error;
    });
