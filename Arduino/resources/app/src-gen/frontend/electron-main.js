// @ts-check

require('reflect-metadata');
require('@theia/electron/shared/@electron/remote/main').initialize();

// Useful for Electron/NW.js apps as GUI apps on macOS doesn't inherit the `$PATH` define
// in your dotfiles (.bashrc/.bash_profile/.zshrc/etc).
// https://github.com/electron/electron/issues/550#issuecomment-162037357
// https://github.com/eclipse-theia/theia/pull/3534#issuecomment-439689082
require('fix-path')();

// Workaround for https://github.com/electron/electron/issues/9225. Chrome has an issue where
// in certain locales (e.g. PL), image metrics are wrongly computed. We explicitly set the
// LC_NUMERIC to prevent this from happening (selects the numeric formatting category of the
// C locale, http://en.cppreference.com/w/cpp/locale/LC_categories).
if (process.env.LC_ALL) {
    process.env.LC_ALL = 'C';
}
process.env.LC_NUMERIC = 'C';

const { default: electronMainApplicationModule } = require('@theia/core/lib/electron-main/electron-main-application-module');
const { ElectronMainApplication, ElectronMainApplicationGlobals } = require('@theia/core/lib/electron-main/electron-main-application');
const { Container } = require('inversify');
const { resolve } = require('path');
const { app } = require('electron');

// Fix the window reloading issue, see: https://github.com/electron/electron/issues/22119
app.allowRendererProcessReuse = false;

const config = {
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
};
const isSingleInstance = true;

if (isSingleInstance && !app.requestSingleInstanceLock()) {
    // There is another instance running, exit now. The other instance will request focus.
    app.quit();
    return;
}

const container = new Container();
container.load(electronMainApplicationModule);
container.bind(ElectronMainApplicationGlobals).toConstantValue({
    THEIA_APP_PROJECT_PATH: resolve(__dirname, '..', '..'),
    THEIA_BACKEND_MAIN_PATH: resolve(__dirname, '..', 'backend', 'main.js'),
    THEIA_FRONTEND_HTML_PATH: resolve(__dirname, '..', '..', 'lib', 'index.html'),
});

function load(raw) {
    return Promise.resolve(raw.default).then(module =>
        container.load(module)
    );
}

async function start() {
    const application = container.get(ElectronMainApplication);
    await application.start(config);
}

module.exports = Promise.resolve()
    .then(function () { return Promise.resolve(require('arduino-ide-extension/lib/electron-main/arduino-electron-main-module')).then(load) })
    .then(start).catch(reason => {
        console.error('Failed to start the electron application.');
        if (reason) {
            console.error(reason);
        }
    });
