"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
const inversify_1 = require("inversify");
const localization_1 = require("../../common/i18n/localization");
const localization_provider_1 = require("./localization-provider");
const common_1 = require("../../common");
const localization_contribution_1 = require("./localization-contribution");
const localization_backend_contribution_1 = require("./localization-backend-contribution");
const backend_application_1 = require("../backend-application");
const theia_localization_contribution_1 = require("./theia-localization-contribution");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(localization_provider_1.LocalizationProvider).toSelf().inSingletonScope();
    bind(common_1.ConnectionHandler).toDynamicValue(ctx => new common_1.JsonRpcConnectionHandler(localization_1.localizationPath, () => ctx.container.get(localization_provider_1.LocalizationProvider))).inSingletonScope();
    bind(localization_contribution_1.LocalizationRegistry).toSelf().inSingletonScope();
    (0, common_1.bindContributionProvider)(bind, localization_contribution_1.LocalizationContribution);
    bind(localization_backend_contribution_1.LocalizationBackendContribution).toSelf().inSingletonScope();
    bind(backend_application_1.BackendApplicationContribution).toService(localization_backend_contribution_1.LocalizationBackendContribution);
    bind(theia_localization_contribution_1.TheiaLocalizationContribution).toSelf().inSingletonScope();
    bind(localization_contribution_1.LocalizationContribution).toService(theia_localization_contribution_1.TheiaLocalizationContribution);
});
//# sourceMappingURL=i18n-backend-module.js.map