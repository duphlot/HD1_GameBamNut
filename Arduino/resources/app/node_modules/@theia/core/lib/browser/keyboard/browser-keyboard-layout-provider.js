"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.KeyboardTester = exports.DEFAULT_LAYOUT_DATA = exports.BrowserKeyboardLayoutProvider = void 0;
const inversify_1 = require("inversify");
const os_1 = require("../../common/os");
const event_1 = require("../../common/event");
const logger_1 = require("../../common/logger");
const promise_util_1 = require("../../common/promise-util");
const storage_service_1 = require("../storage-service");
let BrowserKeyboardLayoutProvider = class BrowserKeyboardLayoutProvider {
    constructor() {
        this.initialized = new promise_util_1.Deferred();
        this.nativeLayoutChanged = new event_1.Emitter();
        this.tester = new KeyboardTester(loadAllLayouts());
        this.source = 'pressed-keys';
        this.currentLayout = exports.DEFAULT_LAYOUT_DATA;
    }
    get onDidChangeNativeLayout() {
        return this.nativeLayoutChanged.event;
    }
    get allLayoutData() {
        return this.tester.candidates.slice();
    }
    get currentLayoutData() {
        return this.currentLayout;
    }
    get currentLayoutSource() {
        return this.source;
    }
    async initialize() {
        await this.loadState();
        const keyboard = navigator.keyboard;
        if (keyboard && keyboard.addEventListener) {
            keyboard.addEventListener('layoutchange', async () => {
                const newLayout = await this.getNativeLayout();
                this.nativeLayoutChanged.fire(newLayout);
            });
        }
        this.initialized.resolve();
    }
    async getNativeLayout() {
        await this.initialized.promise;
        if (this.source === 'user-choice') {
            return this.currentLayout.raw;
        }
        const [layout, source] = await this.autodetect();
        this.setCurrent(layout, source);
        return layout.raw;
    }
    /**
     * Set user-chosen keyboard layout data.
     */
    async setLayoutData(layout) {
        if (layout === 'autodetect') {
            if (this.source === 'user-choice') {
                const [newLayout, source] = await this.autodetect();
                this.setCurrent(newLayout, source);
                this.nativeLayoutChanged.fire(newLayout.raw);
                return newLayout;
            }
            return this.currentLayout;
        }
        else {
            if (this.source !== 'user-choice' || layout !== this.currentLayout) {
                this.setCurrent(layout, 'user-choice');
                this.nativeLayoutChanged.fire(layout.raw);
            }
            return layout;
        }
    }
    /**
     * Test all known keyboard layouts with the given combination of pressed key and
     * produced character. Matching layouts have their score increased (see class
     * KeyboardTester). If this leads to a change of the top-scoring layout, a layout
     * change event is fired.
     */
    validateKey(keyCode) {
        if (this.source !== 'pressed-keys') {
            return;
        }
        const accepted = this.tester.updateScores(keyCode);
        if (!accepted) {
            return;
        }
        const layout = this.selectLayout();
        if (layout !== this.currentLayout && layout !== exports.DEFAULT_LAYOUT_DATA) {
            this.setCurrent(layout, 'pressed-keys');
            this.nativeLayoutChanged.fire(layout.raw);
        }
    }
    setCurrent(layout, source) {
        this.currentLayout = layout;
        this.source = source;
        this.saveState();
        if (this.tester.inputCount && (source === 'pressed-keys' || source === 'navigator.keyboard')) {
            const from = source === 'pressed-keys' ? 'pressed keys' : 'browser API';
            const hardware = layout.hardware === 'mac' ? 'Mac' : 'PC';
            this.logger.info(`Detected keyboard layout from ${from}: ${layout.name} (${hardware})`);
        }
    }
    async autodetect() {
        const keyboard = navigator.keyboard;
        if (keyboard && keyboard.getLayoutMap) {
            try {
                const layoutMap = await keyboard.getLayoutMap();
                this.testLayoutMap(layoutMap);
                return [this.selectLayout(), 'navigator.keyboard'];
            }
            catch (error) {
                this.logger.warn('Failed to obtain keyboard layout map.', error);
            }
        }
        return [this.selectLayout(), 'pressed-keys'];
    }
    /**
     * @param layoutMap a keyboard layout map according to https://wicg.github.io/keyboard-map/
     */
    testLayoutMap(layoutMap) {
        this.tester.reset();
        for (const [code, key] of layoutMap.entries()) {
            this.tester.updateScores({ code, character: key });
        }
    }
    /**
     * Select a layout based on the current tester state and the operating system
     * and language detected from the browser.
     */
    selectLayout() {
        const candidates = this.tester.candidates;
        const scores = this.tester.scores;
        const topScore = this.tester.topScore;
        const language = navigator.language;
        let matchingOScount = 0;
        let topScoringCount = 0;
        for (let i = 0; i < candidates.length; i++) {
            if (scores[i] === topScore) {
                const candidate = candidates[i];
                if (osMatches(candidate.hardware)) {
                    if (language && language.startsWith(candidate.language)) {
                        return candidate;
                    }
                    matchingOScount++;
                }
                topScoringCount++;
            }
        }
        if (matchingOScount >= 1) {
            return candidates.find((c, i) => scores[i] === topScore && osMatches(c.hardware));
        }
        if (topScoringCount >= 1) {
            return candidates.find((_, i) => scores[i] === topScore);
        }
        return exports.DEFAULT_LAYOUT_DATA;
    }
    saveState() {
        const data = {
            tester: this.tester.getState(),
            source: this.source,
            currentLayout: this.currentLayout !== exports.DEFAULT_LAYOUT_DATA ? getLayoutId(this.currentLayout) : undefined
        };
        return this.storageService.setData('keyboard', data);
    }
    async loadState() {
        const data = await this.storageService.getData('keyboard');
        if (data) {
            this.tester.setState(data.tester || {});
            this.source = data.source || 'pressed-keys';
            if (data.currentLayout) {
                const layout = this.tester.candidates.find(c => getLayoutId(c) === data.currentLayout);
                if (layout) {
                    this.currentLayout = layout;
                }
            }
            else {
                this.currentLayout = exports.DEFAULT_LAYOUT_DATA;
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], BrowserKeyboardLayoutProvider.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(storage_service_1.LocalStorageService),
    __metadata("design:type", storage_service_1.LocalStorageService)
], BrowserKeyboardLayoutProvider.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserKeyboardLayoutProvider.prototype, "initialize", null);
BrowserKeyboardLayoutProvider = __decorate([
    (0, inversify_1.injectable)()
], BrowserKeyboardLayoutProvider);
exports.BrowserKeyboardLayoutProvider = BrowserKeyboardLayoutProvider;
function osMatches(hardware) {
    return os_1.isOSX ? hardware === 'mac' : hardware === 'pc';
}
/**
 * This is the fallback keyboard layout selected when nothing else matches.
 * It has an empty mapping, so user inputs are handled like with a standard US keyboard.
 */
exports.DEFAULT_LAYOUT_DATA = {
    name: 'US',
    hardware: os_1.isOSX ? 'mac' : 'pc',
    language: 'en',
    raw: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        info: {},
        mapping: {}
    }
};
/**
 * Holds score values for all known keyboard layouts. Scores are updated
 * by comparing key codes with the corresponding character produced by
 * the user's keyboard.
 */
class KeyboardTester {
    constructor(candidates) {
        this.candidates = candidates;
        this.topScore = 0;
        this.testedInputs = new Map();
        this.scores = this.candidates.map(() => 0);
    }
    get inputCount() {
        return this.testedInputs.size;
    }
    reset() {
        for (let i = 0; i < this.scores.length; i++) {
            this.scores[i] = 0;
        }
        this.topScore = 0;
        this.testedInputs.clear();
    }
    updateScores(input) {
        let property;
        if (input.shiftKey && input.altKey) {
            property = 'withShiftAltGr';
        }
        else if (input.shiftKey) {
            property = 'withShift';
        }
        else if (input.altKey) {
            property = 'withAltGr';
        }
        else {
            property = 'value';
        }
        const inputKey = `${input.code}.${property}`;
        if (this.testedInputs.has(inputKey)) {
            if (this.testedInputs.get(inputKey) === input.character) {
                return false;
            }
            else {
                // The same input keystroke leads to a different character:
                // probably a keyboard layout change, so forget all previous scores
                this.reset();
            }
        }
        const scores = this.scores;
        for (let i = 0; i < this.candidates.length; i++) {
            scores[i] += this.testCandidate(this.candidates[i], input, property);
            if (scores[i] > this.topScore) {
                this.topScore = scores[i];
            }
        }
        this.testedInputs.set(inputKey, input.character);
        return true;
    }
    testCandidate(candidate, input, property) {
        const keyMapping = candidate.raw.mapping[input.code];
        if (keyMapping && keyMapping[property]) {
            return keyMapping[property] === input.character ? 1 : 0;
        }
        else {
            return 0;
        }
    }
    getState() {
        const scores = {};
        for (let i = 0; i < this.scores.length; i++) {
            scores[getLayoutId(this.candidates[i])] = this.scores[i];
        }
        const testedInputs = {};
        for (const [key, character] of this.testedInputs.entries()) {
            testedInputs[key] = character;
        }
        return {
            scores,
            topScore: this.topScore,
            testedInputs
        };
    }
    setState(state) {
        this.reset();
        if (state.scores) {
            const layoutIds = this.candidates.map(getLayoutId);
            for (const id in state.scores) {
                if (state.scores.hasOwnProperty(id)) {
                    const index = layoutIds.indexOf(id);
                    if (index > 0) {
                        this.scores[index] = state.scores[id];
                    }
                }
            }
        }
        if (state.topScore) {
            this.topScore = state.topScore;
        }
        if (state.testedInputs) {
            for (const key in state.testedInputs) {
                if (state.testedInputs.hasOwnProperty(key)) {
                    this.testedInputs.set(key, state.testedInputs[key]);
                }
            }
        }
    }
}
exports.KeyboardTester = KeyboardTester;
function getLayoutId(layout) {
    return `${layout.language}-${layout.name.replace(' ', '_')}-${layout.hardware}`;
}
/**
 * Keyboard layout files are expected to have the following name scheme:
 *     `language-name-hardware.json`
 *
 * - `language`: A language subtag according to IETF BCP 47
 * - `name`:     Display name of the keyboard layout (without dashes)
 * - `hardware`: `pc` or `mac`
 */
function loadLayout(fileName) {
    const [language, name, hardware] = fileName.split('-');
    return {
        name: name.replace('_', ' '),
        hardware: hardware,
        language,
        // Webpack knows what to do here and it should bundle all files under `../../../src/common/keyboard/layouts/`
        // eslint-disable-next-line import/no-dynamic-require
        raw: require('../../../src/common/keyboard/layouts/' + fileName + '.json')
    };
}
function loadAllLayouts() {
    // The order of keyboard layouts is relevant for autodetection. Layouts with
    // lower index have a higher chance of being selected.
    // The current ordering approach is to sort by estimated number of developers
    // in the respective country (taken from the Stack Overflow Developer Survey),
    // but keeping all layouts of the same language together.
    return [
        'en-US-pc',
        'en-US-mac',
        'en-Dvorak-pc',
        'en-Dvorak-mac',
        'en-Dvorak_Lefthanded-pc',
        'en-Dvorak_Lefthanded-mac',
        'en-Dvorak_Righthanded-pc',
        'en-Dvorak_Righthanded-mac',
        'en-Colemak-mac',
        'en-British-pc',
        'en-British-mac',
        'de-German-pc',
        'de-German-mac',
        'de-Swiss_German-pc',
        'de-Swiss_German-mac',
        'fr-French-pc',
        'fr-French-mac',
        'fr-Canadian_French-pc',
        'fr-Canadian_French-mac',
        'fr-Swiss_French-pc',
        'fr-Swiss_French-mac',
        'fr-Bepo-pc',
        'pt-Portuguese-pc',
        'pt-Portuguese-mac',
        'pt-Brazilian-mac',
        'pl-Polish-pc',
        'pl-Polish-mac',
        'nl-Dutch-pc',
        'nl-Dutch-mac',
        'es-Spanish-pc',
        'es-Spanish-mac',
        'it-Italian-pc',
        'it-Italian-mac',
        'sv-Swedish-pc',
        'sv-Swedish-mac',
        'tr-Turkish_Q-pc',
        'tr-Turkish_Q-mac',
        'cs-Czech-pc',
        'cs-Czech-mac',
        'ro-Romanian-pc',
        'ro-Romanian-mac',
        'da-Danish-pc',
        'da-Danish-mac',
        'nb-Norwegian-pc',
        'nb-Norwegian-mac',
        'hu-Hungarian-pc',
        'hu-Hungarian-mac'
    ].map(loadLayout);
}
//# sourceMappingURL=browser-keyboard-layout-provider.js.map