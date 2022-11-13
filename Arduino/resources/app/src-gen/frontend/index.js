// @ts-check

require('reflect-metadata');
require('setimmediate');
const { Container } = require('inversify');
const { FrontendApplicationConfigProvider } = require('@theia/core/lib/browser/frontend-application-config-provider');

FrontendApplicationConfigProvider.set({
    "applicationName": "Arduino IDE",
    "defaultTheme": "arduino-theme",
    "defaultIconTheme": "none",
    "electron": {
        "disallowReloadKeybinding": false,
        "windowOptions": {}
    },
    "defaultLocale": "",
    "preferences": {
        "files.autoSave": "afterDelay",
        "editor.minimap.enabled": false,
        "editor.tabSize": 2,
        "editor.scrollBeyondLastLine": false,
        "editor.quickSuggestions": {
            "other": false,
            "comments": false,
            "strings": false
        },
        "editor.maxTokenizationLineLength": 500,
        "breadcrumbs.enabled": false,
        "workbench.tree.renderIndentGuides": "none",
        "explorer.compactFolders": false
    },
    "arduino.ide.updateChannel": "stable",
    "buildDate": "2022-10-27T13:26:40.924Z"
});


self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        return './editor.worker.js';
    }
}


const { ThemeService } = require('@theia/core/lib/browser/theming');
ThemeService.get().loadUserTheme();

const preloader = require('@theia/core/lib/browser/preloader');

// We need to fetch some data from the backend before the frontend starts (nls, os)
module.exports = preloader.preload().then(() => {
    const { FrontendApplication } = require('@theia/core/lib/browser');
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');
    const { messagingFrontendModule } = require('@theia/core/lib/electron-browser/messaging/electron-messaging-frontend-module');
    const { loggerFrontendModule } = require('@theia/core/lib/browser/logger-frontend-module');

    const container = new Container();
    container.load(frontendApplicationModule);
    container.load(messagingFrontendModule);
    container.load(loggerFrontendModule);

    return Promise.resolve()
    .then(function () { return Promise.resolve(require('@theia/core/lib/browser/i18n/i18n-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/menu/electron-menu-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/window/electron-window-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/keyboard/electron-keyboard-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/token/electron-token-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/variable-resolver/lib/browser/variable-resolver-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/editor/lib/browser/editor-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/browser/filesystem-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/browser/download/file-download-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/electron-browser/file-dialog/electron-file-dialog-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/workspace/lib/browser/workspace-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/markers/lib/browser/problem/problem-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/outline-view/lib/browser/outline-view-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/monaco/lib/browser/monaco-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/console/lib/browser/console-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/output/lib/browser/output-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/common/process-common-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/terminal/lib/browser/terminal-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/userstorage/lib/browser/user-storage-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/task/lib/browser/task-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/debug/lib/browser/debug-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/file-search/lib/browser/file-search-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/preferences/lib/browser/preference-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/keymaps/lib/browser/keymaps-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/messages/lib/browser/messages-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/navigator/lib/browser/navigator-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/navigator/lib/electron-browser/electron-navigator-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/bulk-edit/lib/browser/bulk-edit-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/callhierarchy/lib/browser/callhierarchy-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/scm/lib/browser/scm-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/timeline/lib/browser/timeline-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-frontend-electron-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext-vscode/lib/browser/plugin-vscode-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('arduino-ide-extension/lib/browser/arduino-ide-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('arduino-ide-extension/lib/electron-browser/theia/core/electron-menu-module')).then(load) })
    .then(function () { return Promise.resolve(require('arduino-ide-extension/lib/electron-browser/theia/core/electron-window-module')).then(load) })
        .then(start).catch(reason => {
            console.error('Failed to start the frontend application.');
            if (reason) {
                console.error(reason);
            }
        });

    function load(jsModule) {
        return Promise.resolve(jsModule.default)
            .then(containerModule => container.load(containerModule));
    }

    function start() {
        (window['theia'] = window['theia'] || {}).container = container;
        return container.get(FrontendApplication).start();
    }
});
