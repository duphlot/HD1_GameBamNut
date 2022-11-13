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
exports.KeyboardLayoutService = void 0;
const inversify_1 = require("inversify");
const os_1 = require("../../common/os");
const keyboard_layout_provider_1 = require("../../common/keyboard/keyboard-layout-provider");
const event_1 = require("../../common/event");
const keys_1 = require("./keys");
let KeyboardLayoutService = class KeyboardLayoutService {
    constructor() {
        this.keyboardLayoutChanged = new event_1.Emitter();
    }
    updateLayout(newLayout) {
        const transformed = this.transformNativeLayout(newLayout);
        this.currentLayout = transformed;
        this.keyboardLayoutChanged.fire(transformed);
        return transformed;
    }
    get onKeyboardLayoutChanged() {
        return this.keyboardLayoutChanged.event;
    }
    async initialize() {
        this.layoutChangeNotifier.onDidChangeNativeLayout(newLayout => this.updateLayout(newLayout));
        const initialLayout = await this.layoutProvider.getNativeLayout();
        this.updateLayout(initialLayout);
    }
    /**
     * Resolve a KeyCode of a keybinding using the current keyboard layout.
     * If no keyboard layout has been detected or the layout does not contain the
     * key used in the KeyCode, the KeyCode is returned unchanged.
     */
    resolveKeyCode(inCode) {
        const layout = this.currentLayout;
        if (layout && inCode.key) {
            for (let shift = 0; shift <= 1; shift++) {
                const index = this.getCharacterIndex(inCode.key, !!shift);
                const mappedCode = layout.key2KeyCode[index];
                if (mappedCode) {
                    const transformed = this.transformKeyCode(inCode, mappedCode, !!shift);
                    if (transformed) {
                        return transformed;
                    }
                }
            }
        }
        return inCode;
    }
    /**
     * Return the character shown on the user's keyboard for the given key.
     * Use this to determine UI representations of keybindings.
     */
    getKeyboardCharacter(key) {
        var _a;
        const layout = this.currentLayout;
        if (layout) {
            const value = (_a = layout.code2Character[key.code]) === null || _a === void 0 ? void 0 : _a.trim();
            // Special cases from native keymap
            if (value === '\u001b') {
                return 'escape';
            }
            if (value === '\u007f') {
                return 'delete';
            }
            if (value === '\u0008') {
                return 'backspace';
            }
            if (value === null || value === void 0 ? void 0 : value.replace(/[\n\r\t]/g, '')) {
                return value;
            }
        }
        return key.easyString;
    }
    /**
     * Called when a KeyboardEvent is processed by the KeybindingRegistry.
     * The KeyValidator may trigger a keyboard layout change.
     */
    validateKeyCode(keyCode) {
        if (this.keyValidator && keyCode.key && keyCode.character) {
            this.keyValidator.validateKey({
                code: keyCode.key.code,
                character: keyCode.character,
                shiftKey: keyCode.shift,
                ctrlKey: keyCode.ctrl,
                altKey: keyCode.alt
            });
        }
    }
    transformKeyCode(inCode, mappedCode, keyNeedsShift) {
        if (!inCode.shift && keyNeedsShift) {
            return undefined;
        }
        if (mappedCode.alt && (inCode.alt || inCode.ctrl || inCode.shift && !keyNeedsShift)) {
            return undefined;
        }
        return new keys_1.KeyCode({
            key: mappedCode.key,
            meta: inCode.meta,
            ctrl: inCode.ctrl || mappedCode.alt,
            shift: inCode.shift && !keyNeedsShift || mappedCode.shift,
            alt: inCode.alt || mappedCode.alt
        });
    }
    transformNativeLayout(nativeLayout) {
        const key2KeyCode = new Array(2 * (keys_1.Key.MAX_KEY_CODE + 1));
        const code2Character = {};
        const mapping = nativeLayout.mapping;
        for (const code in mapping) {
            if (mapping.hasOwnProperty(code)) {
                const keyMapping = mapping[code];
                const mappedKey = keys_1.Key.getKey(code);
                if (mappedKey && this.shouldIncludeKey(code)) {
                    if (os_1.isWindows) {
                        this.addWindowsKeyMapping(key2KeyCode, mappedKey, keyMapping.vkey, keyMapping.value);
                    }
                    else {
                        if (keyMapping.value) {
                            this.addKeyMapping(key2KeyCode, mappedKey, keyMapping.value, false, false);
                        }
                        if (keyMapping.withShift) {
                            this.addKeyMapping(key2KeyCode, mappedKey, keyMapping.withShift, true, false);
                        }
                        if (keyMapping.withAltGr) {
                            this.addKeyMapping(key2KeyCode, mappedKey, keyMapping.withAltGr, false, true);
                        }
                        if (keyMapping.withShiftAltGr) {
                            this.addKeyMapping(key2KeyCode, mappedKey, keyMapping.withShiftAltGr, true, true);
                        }
                    }
                }
                if (keyMapping.value) {
                    code2Character[code] = keyMapping.value;
                }
            }
        }
        return { key2KeyCode, code2Character };
    }
    shouldIncludeKey(code) {
        // Exclude all numpad keys because they produce values that are already found elsewhere on the keyboard.
        // This can cause problems, e.g. if `Numpad3` maps to `PageDown` then commands bound to `PageDown` would
        // be resolved to `Digit3` (`Numpad3` is associated with `Key.DIGIT3`), effectively blocking the user
        // from typing `3` in an editor.
        return !code.startsWith('Numpad');
    }
    addKeyMapping(key2KeyCode, mappedKey, value, shift, alt) {
        const key = VALUE_TO_KEY[value];
        if (key) {
            const index = this.getCharacterIndex(key.key, key.shift);
            if (key2KeyCode[index] === undefined) {
                key2KeyCode[index] = new keys_1.KeyCode({
                    key: mappedKey,
                    shift,
                    alt,
                    character: value
                });
            }
        }
    }
    addWindowsKeyMapping(key2KeyCode, mappedKey, vkey, value) {
        const key = VKEY_TO_KEY[vkey];
        if (key) {
            const index = this.getCharacterIndex(key);
            if (key2KeyCode[index] === undefined) {
                key2KeyCode[index] = new keys_1.KeyCode({
                    key: mappedKey,
                    character: value
                });
            }
        }
    }
    getCharacterIndex(key, shift) {
        if (shift) {
            return keys_1.Key.MAX_KEY_CODE + key.keyCode + 1;
        }
        else {
            return key.keyCode;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(keyboard_layout_provider_1.KeyboardLayoutProvider),
    __metadata("design:type", Object)
], KeyboardLayoutService.prototype, "layoutProvider", void 0);
__decorate([
    (0, inversify_1.inject)(keyboard_layout_provider_1.KeyboardLayoutChangeNotifier),
    __metadata("design:type", Object)
], KeyboardLayoutService.prototype, "layoutChangeNotifier", void 0);
__decorate([
    (0, inversify_1.inject)(keyboard_layout_provider_1.KeyValidator),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], KeyboardLayoutService.prototype, "keyValidator", void 0);
KeyboardLayoutService = __decorate([
    (0, inversify_1.injectable)()
], KeyboardLayoutService);
exports.KeyboardLayoutService = KeyboardLayoutService;
/**
 * Mapping of character values to the corresponding keys on a standard US keyboard layout.
 */
const VALUE_TO_KEY = {
    '`': { key: keys_1.Key.BACKQUOTE },
    '~': { key: keys_1.Key.BACKQUOTE, shift: true },
    '1': { key: keys_1.Key.DIGIT1 },
    '!': { key: keys_1.Key.DIGIT1, shift: true },
    '2': { key: keys_1.Key.DIGIT2 },
    '@': { key: keys_1.Key.DIGIT2, shift: true },
    '3': { key: keys_1.Key.DIGIT3 },
    '#': { key: keys_1.Key.DIGIT3, shift: true },
    '4': { key: keys_1.Key.DIGIT4 },
    '$': { key: keys_1.Key.DIGIT4, shift: true },
    '5': { key: keys_1.Key.DIGIT5 },
    '%': { key: keys_1.Key.DIGIT5, shift: true },
    '6': { key: keys_1.Key.DIGIT6 },
    '^': { key: keys_1.Key.DIGIT6, shift: true },
    '7': { key: keys_1.Key.DIGIT7 },
    '&': { key: keys_1.Key.DIGIT7, shift: true },
    '8': { key: keys_1.Key.DIGIT8 },
    '*': { key: keys_1.Key.DIGIT8, shift: true },
    '9': { key: keys_1.Key.DIGIT9 },
    '(': { key: keys_1.Key.DIGIT9, shift: true },
    '0': { key: keys_1.Key.DIGIT0 },
    ')': { key: keys_1.Key.DIGIT0, shift: true },
    '-': { key: keys_1.Key.MINUS },
    '_': { key: keys_1.Key.MINUS, shift: true },
    '=': { key: keys_1.Key.EQUAL },
    '+': { key: keys_1.Key.EQUAL, shift: true },
    'a': { key: keys_1.Key.KEY_A },
    'A': { key: keys_1.Key.KEY_A, shift: true },
    'b': { key: keys_1.Key.KEY_B },
    'B': { key: keys_1.Key.KEY_B, shift: true },
    'c': { key: keys_1.Key.KEY_C },
    'C': { key: keys_1.Key.KEY_C, shift: true },
    'd': { key: keys_1.Key.KEY_D },
    'D': { key: keys_1.Key.KEY_D, shift: true },
    'e': { key: keys_1.Key.KEY_E },
    'E': { key: keys_1.Key.KEY_E, shift: true },
    'f': { key: keys_1.Key.KEY_F },
    'F': { key: keys_1.Key.KEY_F, shift: true },
    'g': { key: keys_1.Key.KEY_G },
    'G': { key: keys_1.Key.KEY_G, shift: true },
    'h': { key: keys_1.Key.KEY_H },
    'H': { key: keys_1.Key.KEY_H, shift: true },
    'i': { key: keys_1.Key.KEY_I },
    'I': { key: keys_1.Key.KEY_I, shift: true },
    'j': { key: keys_1.Key.KEY_J },
    'J': { key: keys_1.Key.KEY_J, shift: true },
    'k': { key: keys_1.Key.KEY_K },
    'K': { key: keys_1.Key.KEY_K, shift: true },
    'l': { key: keys_1.Key.KEY_L },
    'L': { key: keys_1.Key.KEY_L, shift: true },
    'm': { key: keys_1.Key.KEY_M },
    'M': { key: keys_1.Key.KEY_M, shift: true },
    'n': { key: keys_1.Key.KEY_N },
    'N': { key: keys_1.Key.KEY_N, shift: true },
    'o': { key: keys_1.Key.KEY_O },
    'O': { key: keys_1.Key.KEY_O, shift: true },
    'p': { key: keys_1.Key.KEY_P },
    'P': { key: keys_1.Key.KEY_P, shift: true },
    'q': { key: keys_1.Key.KEY_Q },
    'Q': { key: keys_1.Key.KEY_Q, shift: true },
    'r': { key: keys_1.Key.KEY_R },
    'R': { key: keys_1.Key.KEY_R, shift: true },
    's': { key: keys_1.Key.KEY_S },
    'S': { key: keys_1.Key.KEY_S, shift: true },
    't': { key: keys_1.Key.KEY_T },
    'T': { key: keys_1.Key.KEY_T, shift: true },
    'u': { key: keys_1.Key.KEY_U },
    'U': { key: keys_1.Key.KEY_U, shift: true },
    'v': { key: keys_1.Key.KEY_V },
    'V': { key: keys_1.Key.KEY_V, shift: true },
    'w': { key: keys_1.Key.KEY_W },
    'W': { key: keys_1.Key.KEY_W, shift: true },
    'x': { key: keys_1.Key.KEY_X },
    'X': { key: keys_1.Key.KEY_X, shift: true },
    'y': { key: keys_1.Key.KEY_Y },
    'Y': { key: keys_1.Key.KEY_Y, shift: true },
    'z': { key: keys_1.Key.KEY_Z },
    'Z': { key: keys_1.Key.KEY_Z, shift: true },
    '[': { key: keys_1.Key.BRACKET_LEFT },
    '{': { key: keys_1.Key.BRACKET_LEFT, shift: true },
    ']': { key: keys_1.Key.BRACKET_RIGHT },
    '}': { key: keys_1.Key.BRACKET_RIGHT, shift: true },
    ';': { key: keys_1.Key.SEMICOLON },
    ':': { key: keys_1.Key.SEMICOLON, shift: true },
    "'": { key: keys_1.Key.QUOTE },
    '"': { key: keys_1.Key.QUOTE, shift: true },
    ',': { key: keys_1.Key.COMMA },
    '<': { key: keys_1.Key.COMMA, shift: true },
    '.': { key: keys_1.Key.PERIOD },
    '>': { key: keys_1.Key.PERIOD, shift: true },
    '/': { key: keys_1.Key.SLASH },
    '?': { key: keys_1.Key.SLASH, shift: true },
    '\\': { key: keys_1.Key.BACKSLASH },
    '|': { key: keys_1.Key.BACKSLASH, shift: true },
    '\t': { key: keys_1.Key.TAB },
    '\r': { key: keys_1.Key.ENTER },
    '\n': { key: keys_1.Key.ENTER },
    ' ': { key: keys_1.Key.SPACE },
};
/**
 * Mapping of Windows Virtual Keys to the corresponding keys on a standard US keyboard layout.
 */
const VKEY_TO_KEY = {
    VK_SHIFT: keys_1.Key.SHIFT_LEFT,
    VK_LSHIFT: keys_1.Key.SHIFT_LEFT,
    VK_RSHIFT: keys_1.Key.SHIFT_RIGHT,
    VK_CONTROL: keys_1.Key.CONTROL_LEFT,
    VK_LCONTROL: keys_1.Key.CONTROL_LEFT,
    VK_RCONTROL: keys_1.Key.CONTROL_RIGHT,
    VK_MENU: keys_1.Key.ALT_LEFT,
    VK_COMMAND: keys_1.Key.OS_LEFT,
    VK_LWIN: keys_1.Key.OS_LEFT,
    VK_RWIN: keys_1.Key.OS_RIGHT,
    VK_0: keys_1.Key.DIGIT0,
    VK_1: keys_1.Key.DIGIT1,
    VK_2: keys_1.Key.DIGIT2,
    VK_3: keys_1.Key.DIGIT3,
    VK_4: keys_1.Key.DIGIT4,
    VK_5: keys_1.Key.DIGIT5,
    VK_6: keys_1.Key.DIGIT6,
    VK_7: keys_1.Key.DIGIT7,
    VK_8: keys_1.Key.DIGIT8,
    VK_9: keys_1.Key.DIGIT9,
    VK_A: keys_1.Key.KEY_A,
    VK_B: keys_1.Key.KEY_B,
    VK_C: keys_1.Key.KEY_C,
    VK_D: keys_1.Key.KEY_D,
    VK_E: keys_1.Key.KEY_E,
    VK_F: keys_1.Key.KEY_F,
    VK_G: keys_1.Key.KEY_G,
    VK_H: keys_1.Key.KEY_H,
    VK_I: keys_1.Key.KEY_I,
    VK_J: keys_1.Key.KEY_J,
    VK_K: keys_1.Key.KEY_K,
    VK_L: keys_1.Key.KEY_L,
    VK_M: keys_1.Key.KEY_M,
    VK_N: keys_1.Key.KEY_N,
    VK_O: keys_1.Key.KEY_O,
    VK_P: keys_1.Key.KEY_P,
    VK_Q: keys_1.Key.KEY_Q,
    VK_R: keys_1.Key.KEY_R,
    VK_S: keys_1.Key.KEY_S,
    VK_T: keys_1.Key.KEY_T,
    VK_U: keys_1.Key.KEY_U,
    VK_V: keys_1.Key.KEY_V,
    VK_W: keys_1.Key.KEY_W,
    VK_X: keys_1.Key.KEY_X,
    VK_Y: keys_1.Key.KEY_Y,
    VK_Z: keys_1.Key.KEY_Z,
    VK_OEM_1: keys_1.Key.SEMICOLON,
    VK_OEM_2: keys_1.Key.SLASH,
    VK_OEM_3: keys_1.Key.BACKQUOTE,
    VK_OEM_4: keys_1.Key.BRACKET_LEFT,
    VK_OEM_5: keys_1.Key.BACKSLASH,
    VK_OEM_6: keys_1.Key.BRACKET_RIGHT,
    VK_OEM_7: keys_1.Key.QUOTE,
    VK_OEM_PLUS: keys_1.Key.EQUAL,
    VK_OEM_COMMA: keys_1.Key.COMMA,
    VK_OEM_MINUS: keys_1.Key.MINUS,
    VK_OEM_PERIOD: keys_1.Key.PERIOD,
    VK_F1: keys_1.Key.F1,
    VK_F2: keys_1.Key.F2,
    VK_F3: keys_1.Key.F3,
    VK_F4: keys_1.Key.F4,
    VK_F5: keys_1.Key.F5,
    VK_F6: keys_1.Key.F6,
    VK_F7: keys_1.Key.F7,
    VK_F8: keys_1.Key.F8,
    VK_F9: keys_1.Key.F9,
    VK_F10: keys_1.Key.F10,
    VK_F11: keys_1.Key.F11,
    VK_F12: keys_1.Key.F12,
    VK_F13: keys_1.Key.F13,
    VK_F14: keys_1.Key.F14,
    VK_F15: keys_1.Key.F15,
    VK_F16: keys_1.Key.F16,
    VK_F17: keys_1.Key.F17,
    VK_F18: keys_1.Key.F18,
    VK_F19: keys_1.Key.F19,
    VK_BACK: keys_1.Key.BACKSPACE,
    VK_TAB: keys_1.Key.TAB,
    VK_RETURN: keys_1.Key.ENTER,
    VK_CAPITAL: keys_1.Key.CAPS_LOCK,
    VK_ESCAPE: keys_1.Key.ESCAPE,
    VK_SPACE: keys_1.Key.SPACE,
    VK_PRIOR: keys_1.Key.PAGE_UP,
    VK_NEXT: keys_1.Key.PAGE_DOWN,
    VK_END: keys_1.Key.END,
    VK_HOME: keys_1.Key.HOME,
    VK_INSERT: keys_1.Key.INSERT,
    VK_DELETE: keys_1.Key.DELETE,
    VK_LEFT: keys_1.Key.ARROW_LEFT,
    VK_UP: keys_1.Key.ARROW_UP,
    VK_RIGHT: keys_1.Key.ARROW_RIGHT,
    VK_DOWN: keys_1.Key.ARROW_DOWN,
    VK_NUMLOCK: keys_1.Key.NUM_LOCK,
    VK_NUMPAD0: keys_1.Key.DIGIT0,
    VK_NUMPAD1: keys_1.Key.DIGIT1,
    VK_NUMPAD2: keys_1.Key.DIGIT2,
    VK_NUMPAD3: keys_1.Key.DIGIT3,
    VK_NUMPAD4: keys_1.Key.DIGIT4,
    VK_NUMPAD5: keys_1.Key.DIGIT5,
    VK_NUMPAD6: keys_1.Key.DIGIT6,
    VK_NUMPAD7: keys_1.Key.DIGIT7,
    VK_NUMPAD8: keys_1.Key.DIGIT8,
    VK_NUMPAD9: keys_1.Key.DIGIT9,
    VK_MULTIPLY: keys_1.Key.MULTIPLY,
    VK_ADD: keys_1.Key.ADD,
    VK_SUBTRACT: keys_1.Key.SUBTRACT,
    VK_DECIMAL: keys_1.Key.DECIMAL,
    VK_DIVIDE: keys_1.Key.DIVIDE
};
//# sourceMappingURL=keyboard-layout-service.js.map