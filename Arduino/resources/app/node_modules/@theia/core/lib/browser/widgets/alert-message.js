"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.AlertMessage = void 0;
const React = require("react");
const widget_1 = require("./widget");
const AlertMessageIcon = {
    INFO: (0, widget_1.codicon)('info'),
    SUCCESS: (0, widget_1.codicon)('pass'),
    WARNING: (0, widget_1.codicon)('warning'),
    ERROR: (0, widget_1.codicon)('error')
};
class AlertMessage extends React.Component {
    render() {
        return React.createElement("div", { className: 'theia-alert-message-container' },
            React.createElement("div", { className: `theia-${this.props.type.toLowerCase()}-alert` },
                React.createElement("div", { className: 'theia-message-header' },
                    React.createElement("i", { className: AlertMessageIcon[this.props.type] }),
                    "\u00A0",
                    this.props.header),
                React.createElement("div", { className: 'theia-message-content' }, this.props.children)));
    }
}
exports.AlertMessage = AlertMessage;
//# sourceMappingURL=alert-message.js.map