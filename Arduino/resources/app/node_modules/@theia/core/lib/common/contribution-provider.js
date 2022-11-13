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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindContribution = exports.bindContributionProvider = exports.Bindable = exports.ContributionProvider = void 0;
const contribution_filter_1 = require("./contribution-filter");
exports.ContributionProvider = Symbol('ContributionProvider');
class ContainerBasedContributionProvider {
    constructor(serviceIdentifier, container) {
        this.serviceIdentifier = serviceIdentifier;
        this.container = container;
    }
    getContributions(recursive) {
        if (this.services === undefined) {
            const currentServices = [];
            let filterRegistry;
            let currentContainer = this.container;
            // eslint-disable-next-line no-null/no-null
            while (currentContainer !== null) {
                if (currentContainer.isBound(this.serviceIdentifier)) {
                    try {
                        currentServices.push(...currentContainer.getAll(this.serviceIdentifier));
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                if (filterRegistry === undefined && currentContainer.isBound(contribution_filter_1.ContributionFilterRegistry)) {
                    filterRegistry = currentContainer.get(contribution_filter_1.ContributionFilterRegistry);
                }
                // eslint-disable-next-line no-null/no-null
                currentContainer = recursive === true ? currentContainer.parent : null;
            }
            this.services = filterRegistry ? filterRegistry.applyFilters(currentServices, this.serviceIdentifier) : currentServices;
        }
        return this.services;
    }
}
var Bindable;
(function (Bindable) {
    function isContainer(arg) {
        return typeof arg !== 'function'
            // https://github.com/eclipse-theia/theia/issues/3204#issue-371029654
            // In InversifyJS `4.14.0` containers no longer have a property `guid`.
            && ('guid' in arg || 'parent' in arg);
    }
    Bindable.isContainer = isContainer;
})(Bindable = exports.Bindable || (exports.Bindable = {}));
function bindContributionProvider(bindable, id) {
    const bindingToSyntax = (Bindable.isContainer(bindable) ? bindable.bind(exports.ContributionProvider) : bindable(exports.ContributionProvider));
    bindingToSyntax
        .toDynamicValue(ctx => new ContainerBasedContributionProvider(id, ctx.container))
        .inSingletonScope().whenTargetNamed(id);
}
exports.bindContributionProvider = bindContributionProvider;
/**
 * Helper function to bind a service to a list of contributions easily.
 * @param bindable a Container or the bind function directly.
 * @param service an already bound service to refer the contributions to.
 * @param contributions array of contribution identifiers to bind the service to.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bindContribution(bindable, service, contributions) {
    const bind = Bindable.isContainer(bindable) ? bindable.bind.bind(bindable) : bindable;
    for (const contribution of contributions) {
        bind(contribution).toService(service);
    }
}
exports.bindContribution = bindContribution;
//# sourceMappingURL=contribution-provider.js.map