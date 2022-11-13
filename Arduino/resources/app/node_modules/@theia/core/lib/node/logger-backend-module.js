"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.loggerBackendModule = exports.bindLogger = void 0;
const inversify_1 = require("inversify");
const messaging_1 = require("../common/messaging");
const logger_1 = require("../common/logger");
const logger_protocol_1 = require("../common/logger-protocol");
const console_logger_server_1 = require("./console-logger-server");
const logger_watcher_1 = require("../common/logger-watcher");
const backend_application_1 = require("./backend-application");
const cli_1 = require("./cli");
const logger_cli_contribution_1 = require("./logger-cli-contribution");
function bindLogger(bind, props) {
    bind(logger_1.LoggerName).toConstantValue(logger_1.rootLoggerName);
    bind(logger_1.ILogger).to(logger_1.Logger).inSingletonScope().whenTargetIsDefault();
    bind(logger_watcher_1.LoggerWatcher).toSelf().inSingletonScope();
    bind(logger_protocol_1.ILoggerServer).to(console_logger_server_1.ConsoleLoggerServer).inSingletonScope().onActivation((context, server) => {
        if (props && props.onLoggerServerActivation) {
            props.onLoggerServerActivation(context, server);
        }
        return server;
    });
    bind(logger_cli_contribution_1.LogLevelCliContribution).toSelf().inSingletonScope();
    bind(cli_1.CliContribution).toService(logger_cli_contribution_1.LogLevelCliContribution);
    bind(logger_1.LoggerFactory).toFactory(ctx => (name) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(logger_1.ILogger).to(logger_1.Logger).inTransientScope();
        child.bind(logger_1.LoggerName).toConstantValue(name);
        return child.get(logger_1.ILogger);
    });
}
exports.bindLogger = bindLogger;
/**
 * IMPORTANT: don't use in tests, since it overrides console
 */
exports.loggerBackendModule = new inversify_1.ContainerModule(bind => {
    bind(backend_application_1.BackendApplicationContribution).toDynamicValue(ctx => ({
        initialize() {
            (0, logger_1.setRootLogger)(ctx.container.get(logger_1.ILogger));
        }
    }));
    bind(logger_protocol_1.DispatchingLoggerClient).toSelf().inSingletonScope();
    bindLogger(bind, {
        onLoggerServerActivation: ({ container }, server) => {
            server.setClient(container.get(logger_protocol_1.DispatchingLoggerClient));
            server.setClient = () => {
                throw new Error('use DispatchingLoggerClient');
            };
        }
    });
    bind(messaging_1.ConnectionHandler).toDynamicValue(({ container }) => new messaging_1.JsonRpcConnectionHandler(logger_protocol_1.loggerPath, client => {
        const dispatching = container.get(logger_protocol_1.DispatchingLoggerClient);
        dispatching.clients.add(client);
        client.onDidCloseConnection(() => dispatching.clients.delete(client));
        return container.get(logger_protocol_1.ILoggerServer);
    })).inSingletonScope();
});
//# sourceMappingURL=logger-backend-module.js.map