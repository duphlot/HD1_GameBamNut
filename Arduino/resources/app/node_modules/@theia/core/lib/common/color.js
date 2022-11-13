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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
var Color;
(function (Color) {
    function rgba(r, g, b, a = 1) {
        return { r, g, b, a };
    }
    Color.rgba = rgba;
    function hsla(h, s, l, a = 1) {
        return { h, s, l, a };
    }
    Color.hsla = hsla;
    Color.white = rgba(255, 255, 255, 1);
    Color.black = rgba(0, 0, 0, 1);
    function transparent(v, f) {
        return { v, f, kind: 'transparent' };
    }
    Color.transparent = transparent;
    function lighten(v, f) {
        return { v, f, kind: 'lighten' };
    }
    Color.lighten = lighten;
    function darken(v, f) {
        return { v, f, kind: 'darken' };
    }
    Color.darken = darken;
})(Color = exports.Color || (exports.Color = {}));
//# sourceMappingURL=color.js.map