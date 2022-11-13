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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const inversify_1 = require("inversify");
const message_service_protocol_1 = require("./message-service-protocol");
const cancellation_1 = require("./cancellation");
/**
 * Service to log and categorize messages, show progress information and offer actions.
 *
 * The messages are processed by this service and forwarded to an injected {@link MessageClient}.
 * For example "@theia/messages" provides such a client, rendering messages as notifications
 * in the frontend.
 *
 * ### Example usage
 *
 * ```typescript
 *   @inject(MessageService)
 *   protected readonly messageService: MessageService;
 *
 *   messageService.warn("Typings not available");
 *
 *   messageService.error("Could not restore state", ["Rollback", "Ignore"])
 *   .then(action => action === "Rollback" && rollback());
 * ```
 */
let MessageService = class MessageService {
    constructor(client) {
        this.client = client;
        this.progressIdPrefix = Math.random().toString(36).substring(5);
        this.counter = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Log, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Info, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Warning, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Error, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processMessage(type, text, args) {
        if (!!args && args.length > 0) {
            const first = args[0];
            const actions = Array.from(new Set(args.filter(a => typeof a === 'string')));
            const options = (typeof first === 'object' && !Array.isArray(first))
                ? first
                : undefined;
            return this.client.showMessage({ type, options, text, actions });
        }
        return this.client.showMessage({ type, text });
    }
    /**
     * Shows the given message as a progress.
     *
     * @param message the message to show for the progress.
     * @param onDidCancel an optional callback which will be invoked if the progress indicator was canceled.
     *
     * @returns a promise resolving to a {@link Progress} object with which the progress can be updated.
     *
     * ### Example usage
     *
     * ```typescript
     *   @inject(MessageService)
     *   protected readonly messageService: MessageService;
     *
     *   // this will show "Progress" as a cancelable message
     *   this.messageService.showProgress({text: 'Progress'});
     *
     *   // this will show "Rolling back" with "Cancel" and an additional "Skip" action
     *   this.messageService.showProgress({
     *     text: `Rolling back`,
     *     actions: ["Skip"],
     *   },
     *   () => console.log("canceled"))
     *   .then((progress) => {
     *     // register if interested in the result (only necessary for custom actions)
     *     progress.result.then((result) => {
     *       // will be 'Cancel', 'Skip' or `undefined`
     *       console.log("result is", result);
     *     });
     *     progress.report({message: "Cleaning references", work: {done: 10, total: 100}});
     *     progress.report({message: "Restoring previous state", work: {done: 80, total: 100}});
     *     progress.report({message: "Complete", work: {done: 100, total: 100}});
     *     // we are done so we can cancel the progress message, note that this will also invoke `onDidCancel`
     *     progress.cancel();
     *   });
     * ```
     */
    async showProgress(message, onDidCancel) {
        var _a;
        const id = this.newProgressId();
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        const report = (update) => {
            this.client.reportProgress(id, update, message, cancellationSource.token);
        };
        const type = (_a = message.type) !== null && _a !== void 0 ? _a : message_service_protocol_1.MessageType.Progress;
        const actions = new Set(message.actions);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message)) {
            actions.delete(message_service_protocol_1.ProgressMessage.Cancel);
            actions.add(message_service_protocol_1.ProgressMessage.Cancel);
        }
        const clientMessage = Object.assign(Object.assign({}, message), { type, actions: Array.from(actions) });
        const result = this.client.showProgress(id, clientMessage, cancellationSource.token);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message) && typeof onDidCancel === 'function') {
            result.then(value => {
                if (value === message_service_protocol_1.ProgressMessage.Cancel) {
                    onDidCancel();
                }
            });
        }
        return {
            id,
            cancel: () => cancellationSource.cancel(),
            result,
            report
        };
    }
    newProgressId() {
        return `${this.progressIdPrefix}-${++this.counter}`;
    }
};
MessageService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(message_service_protocol_1.MessageClient)),
    __metadata("design:paramtypes", [message_service_protocol_1.MessageClient])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message-service.js.map