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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureTextHeight = exports.measureTextWidth = exports.preventNavigation = exports.parseCssTime = exports.parseCssMagnitude = exports.animationFrame = exports.isBasicWasmSupported = exports.isNative = exports.isIPad = exports.isSafari = exports.isChrome = exports.isWebKit = exports.isFirefox = exports.isOpera = exports.isEdgeOrIE = exports.isEdge = exports.isIE = void 0;
const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
exports.isIE = (userAgent.indexOf('Trident') >= 0);
exports.isEdge = (userAgent.indexOf('Edge/') >= 0);
exports.isEdgeOrIE = exports.isIE || exports.isEdge;
exports.isOpera = (userAgent.indexOf('Opera') >= 0);
exports.isFirefox = (userAgent.indexOf('Firefox') >= 0);
exports.isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
exports.isChrome = (userAgent.indexOf('Chrome') >= 0);
exports.isSafari = (userAgent.indexOf('Chrome') === -1) && (userAgent.indexOf('Safari') >= 0);
exports.isIPad = (userAgent.indexOf('iPad') >= 0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.isNative = typeof window.process !== 'undefined';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.isBasicWasmSupported = typeof window.WebAssembly !== 'undefined';
/**
 * Resolves after the next animation frame if no parameter is given,
 * or after the given number of animation frames.
 */
function animationFrame(n = 1) {
    return new Promise(resolve => {
        function frameFunc() {
            if (n <= 0) {
                resolve();
            }
            else {
                n--;
                requestAnimationFrame(frameFunc);
            }
        }
        frameFunc();
    });
}
exports.animationFrame = animationFrame;
function parseCssMagnitude(value, defaultValue) {
    if (value) {
        let parsed;
        if (value.endsWith('px')) {
            parsed = parseFloat(value.substring(0, value.length - 2));
        }
        else {
            parsed = parseFloat(value);
        }
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    return defaultValue;
}
exports.parseCssMagnitude = parseCssMagnitude;
function parseCssTime(time, defaultValue) {
    if (time) {
        let parsed;
        if (time.endsWith('ms')) {
            parsed = parseFloat(time.substring(0, time.length - 2));
        }
        else if (time.endsWith('s')) {
            parsed = parseFloat(time.substring(0, time.length - 1)) * 1000;
        }
        else {
            parsed = parseFloat(time);
        }
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    return defaultValue;
}
exports.parseCssTime = parseCssTime;
function getMonacoEditorScroll(elem) {
    const linesContent = elem.querySelector('.lines-content');
    const viewLines = elem.querySelector('.view-lines');
    // eslint-disable-next-line no-null/no-null
    if (linesContent === null || viewLines === null) {
        return undefined;
    }
    const linesContentStyle = linesContent.style;
    const elemStyle = elem.style;
    const viewLinesStyle = viewLines.style;
    return {
        left: -parseCssMagnitude(linesContentStyle.left, 0),
        top: -parseCssMagnitude(linesContentStyle.top, 0),
        maxLeft: parseCssMagnitude(viewLinesStyle.width, 0) - parseCssMagnitude(elemStyle.width, 0),
        maxTop: parseCssMagnitude(viewLinesStyle.height, 0) - parseCssMagnitude(elemStyle.height, 0)
    };
}
/**
 * Prevent browser back/forward navigation of a mouse wheel event.
 */
function preventNavigation(event) {
    const { currentTarget, deltaX, deltaY } = event;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    let elem = event.target;
    while (elem && elem !== currentTarget) {
        let scroll;
        if (elem.classList.contains('monaco-scrollable-element')) {
            scroll = getMonacoEditorScroll(elem);
        }
        else {
            scroll = {
                left: elem.scrollLeft,
                top: elem.scrollTop,
                maxLeft: elem.scrollWidth - elem.clientWidth,
                maxTop: elem.scrollHeight - elem.clientHeight
            };
        }
        if (scroll) {
            const scrollH = scroll.maxLeft > 0 && (deltaX < 0 && scroll.left > 0 || deltaX > 0 && scroll.left < scroll.maxLeft);
            const scrollV = scroll.maxTop > 0 && (deltaY < 0 && scroll.top > 0 || deltaY > 0 && scroll.top < scroll.maxTop);
            if (scrollH && scrollV || scrollH && absDeltaX > absDeltaY || scrollV && absDeltaY > absDeltaX) {
                // The event is consumed by the scrollable child element
                return;
            }
        }
        elem = elem.parentElement;
    }
    event.preventDefault();
    event.stopPropagation();
}
exports.preventNavigation = preventNavigation;
function measureTextWidth(text, style) {
    const measureElement = getMeasurementElement(style);
    text = Array.isArray(text) ? text : [text];
    let width = 0;
    for (const item of text) {
        measureElement.textContent = item;
        width = Math.max(measureElement.getBoundingClientRect().width, width);
    }
    return width;
}
exports.measureTextWidth = measureTextWidth;
function measureTextHeight(text, style) {
    const measureElement = getMeasurementElement(style);
    text = Array.isArray(text) ? text : [text];
    let height = 0;
    for (const item of text) {
        measureElement.textContent = item;
        height = Math.max(measureElement.getBoundingClientRect().height, height);
    }
    return height;
}
exports.measureTextHeight = measureTextHeight;
const defaultStyle = document.createElement('div').style;
defaultStyle.fontFamily = 'var(--theia-ui-font-family)';
defaultStyle.fontSize = 'var(--theia-ui-font-size1)';
defaultStyle.visibility = 'hidden';
function getMeasurementElement(style) {
    let measureElement = document.getElementById('measure');
    if (!measureElement) {
        measureElement = document.createElement('span');
        measureElement.id = 'measure';
        measureElement.style.fontFamily = defaultStyle.fontFamily;
        measureElement.style.fontSize = defaultStyle.fontSize;
        measureElement.style.visibility = defaultStyle.visibility;
        document.body.appendChild(measureElement);
    }
    const measureStyle = measureElement.style;
    // Reset styling first
    for (let i = 0; i < measureStyle.length; i++) {
        const property = measureStyle[i];
        measureStyle.setProperty(property, defaultStyle.getPropertyValue(property));
    }
    // Apply new styling
    if (style) {
        for (const [key, value] of Object.entries(style)) {
            measureStyle.setProperty(key, value);
        }
    }
    return measureElement;
}
//# sourceMappingURL=browser.js.map