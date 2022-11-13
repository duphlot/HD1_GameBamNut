"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.PreferenceValidationService = void 0;
const preference_contribution_1 = require("./preference-contribution");
const preference_language_override_service_1 = require("./preference-language-override-service");
const inversify_1 = require("../../../shared/inversify");
const common_1 = require("../../common");
const preference_provider_1 = require("./preference-provider");
let PreferenceValidationService = class PreferenceValidationService {
    validateOptions(options) {
        const valid = {};
        let problemsDetected = false;
        for (const [preferenceName, value] of Object.entries(options)) {
            const validValue = this.validateByName(preferenceName, value);
            if (validValue !== value) {
                problemsDetected = true;
            }
            valid[preferenceName] = validValue;
        }
        return problemsDetected ? valid : options;
    }
    validateByName(preferenceName, value) {
        const validValue = this.doValidateByName(preferenceName, value);
        // If value is undefined, it means the preference wasn't set, not that a bad value was set.
        if (validValue !== value && value !== undefined) {
            console.warn(`While validating options, found impermissible value for ${preferenceName}. Using valid value`, validValue, 'instead of configured value', value);
        }
        return validValue;
    }
    doValidateByName(preferenceName, value) {
        const schema = this.getSchema(preferenceName);
        return this.validateBySchema(preferenceName, value, schema);
    }
    validateBySchema(key, value, schema) {
        try {
            if (!schema) {
                console.warn('Request to validate preference with no schema registered:', key);
                return value;
            }
            if (schema.const !== undefined) {
                return this.validateConst(key, value, schema);
            }
            if (Array.isArray(schema.enum)) {
                return this.validateEnum(key, value, schema);
            }
            if (Array.isArray(schema.anyOf)) {
                return this.validateAnyOf(key, value, schema);
            }
            if (Array.isArray(schema.oneOf)) {
                return this.validateOneOf(key, value, schema);
            }
            if (schema.type === undefined) {
                console.warn('Request to validate preference with no type information:', key);
                return value;
            }
            if (Array.isArray(schema.type)) {
                return this.validateMultiple(key, value, schema);
            }
            switch (schema.type) {
                case 'array':
                    return this.validateArray(key, value, schema);
                case 'boolean':
                    return this.validateBoolean(key, value, schema);
                case 'integer':
                    return this.validateInteger(key, value, schema);
                case 'null':
                    return null; // eslint-disable-line no-null/no-null
                case 'number':
                    return this.validateNumber(key, value, schema);
                case 'object':
                    return this.validateObject(key, value, schema);
                case 'string':
                    return this.validateString(key, value, schema);
                default:
                    (0, common_1.unreachable)(schema.type, `Request to validate preference with unknown type in schema: ${key}`);
            }
        }
        catch (e) {
            console.error('Encountered an error while validating', key, 'with value', value, 'against schema', schema, e);
            return value;
        }
    }
    getSchema(name) {
        var _a;
        const combinedSchema = this.schemaProvider.getCombinedSchema().properties;
        if (combinedSchema[name]) {
            return combinedSchema[name];
        }
        const baseName = (_a = this.languageOverrideService.overriddenPreferenceName(name)) === null || _a === void 0 ? void 0 : _a.preferenceName;
        return baseName !== undefined ? combinedSchema[baseName] : undefined;
    }
    validateMultiple(key, value, schema) {
        const validation = (0, common_1.deepClone)(schema);
        const candidate = this.mapValidators(key, value, (function* () {
            for (const type of schema.type) {
                validation.type = type;
                yield toValidate => this.validateBySchema(key, toValidate, validation);
            }
        }).bind(this)());
        if (candidate !== value && (schema.default !== undefined || schema.defaultValue !== undefined)) {
            const configuredDefault = this.getDefaultFromSchema(schema);
            return this.validateMultiple(key, configuredDefault, Object.assign(Object.assign({}, schema), { default: undefined, defaultValue: undefined }));
        }
        return candidate;
    }
    validateAnyOf(key, value, schema) {
        const candidate = this.mapValidators(key, value, (function* () {
            for (const option of schema.anyOf) {
                yield toValidate => this.validateBySchema(key, toValidate, option);
            }
        }).bind(this)());
        if (candidate !== value && (schema.default !== undefined || schema.defaultValue !== undefined)) {
            const configuredDefault = this.getDefaultFromSchema(schema);
            return this.validateAnyOf(key, configuredDefault, Object.assign(Object.assign({}, schema), { default: undefined, defaultValue: undefined }));
        }
        return candidate;
    }
    validateOneOf(key, value, schema) {
        let passed = false;
        for (const subSchema of schema.oneOf) {
            const validValue = this.validateBySchema(key, value, subSchema);
            if (!passed && validValue === value) {
                passed = true;
            }
            else if (passed && validValue === value) {
                passed = false;
                break;
            }
        }
        if (passed) {
            return value;
        }
        if (schema.default !== undefined || schema.defaultValue !== undefined) {
            const configuredDefault = this.getDefaultFromSchema(schema);
            return this.validateOneOf(key, configuredDefault, Object.assign(Object.assign({}, schema), { default: undefined, defaultValue: undefined }));
        }
        console.log(`While validating ${key}, failed to find a valid value or default value. Using configured value ${value}.`);
        return value;
    }
    mapValidators(key, value, validators) {
        const candidates = [];
        for (const validator of validators) {
            const candidate = validator(value);
            if (candidate === value) {
                return candidate;
            }
            candidates.push(candidate);
        }
        return candidates[0];
    }
    validateArray(key, value, schema) {
        const candidate = Array.isArray(value) ? value : this.getDefaultFromSchema(schema);
        if (!Array.isArray(candidate)) {
            return [];
        }
        if (!schema.items && !schema.prefixItems) {
            console.warn('Requested validation of array without item specification:', key);
            return candidate;
        }
        if (Array.isArray(schema.items) || Array.isArray(schema.prefixItems)) {
            return this.validateTuple(key, value, schema);
        }
        const itemSchema = schema.items;
        const valid = candidate.filter(item => this.validateBySchema(key, item, itemSchema) === item);
        return valid.length === candidate.length ? candidate : valid;
    }
    validateTuple(key, value, schema) {
        var _a, _b;
        const defaultValue = this.getDefaultFromSchema(schema);
        const maybeCandidate = Array.isArray(value) ? value : defaultValue;
        // If we find that the provided value is not valid, we immediately bail and try the default value instead.
        const shouldTryDefault = Array.isArray((_a = schema.defaultValue) !== null && _a !== void 0 ? _a : schema.default) && !preference_provider_1.PreferenceProvider.deepEqual(defaultValue, maybeCandidate);
        const tryDefault = () => this.validateTuple(key, defaultValue, schema);
        const candidate = Array.isArray(maybeCandidate) ? maybeCandidate : [];
        // Only `prefixItems` is officially part of the JSON Schema spec, but `items` as array was part of a draft and was used by VSCode.
        const tuple = ((_b = schema.prefixItems) !== null && _b !== void 0 ? _b : schema.items);
        const lengthIsWrong = candidate.length < tuple.length || (candidate.length > tuple.length && !schema.additionalItems);
        if (lengthIsWrong && shouldTryDefault) {
            return tryDefault();
        }
        let valid = true;
        const validItems = [];
        for (const [index, subschema] of tuple.entries()) {
            const targetItem = candidate[index];
            const validatedItem = targetItem === undefined ? this.getDefaultFromSchema(subschema) : this.validateBySchema(key, targetItem, subschema);
            valid && (valid = validatedItem === targetItem);
            if (!valid && shouldTryDefault) {
                return tryDefault();
            }
            validItems.push(validatedItem);
        }
        ;
        if (candidate.length > tuple.length) {
            if (!schema.additionalItems) {
                return validItems;
            }
            else if (schema.additionalItems === true && !valid) {
                validItems.push(...candidate.slice(tuple.length));
                return validItems;
            }
            else if (schema.additionalItems !== true) {
                const applicableSchema = schema.additionalItems;
                for (let i = tuple.length; i < candidate.length; i++) {
                    const targetItem = candidate[i];
                    const validatedItem = this.validateBySchema(key, targetItem, applicableSchema);
                    if (validatedItem === targetItem) {
                        validItems.push(targetItem);
                    }
                    else {
                        valid = false;
                        if (shouldTryDefault) {
                            return tryDefault();
                        }
                    }
                }
            }
        }
        return valid ? candidate : validItems;
    }
    validateConst(key, value, schema) {
        if (preference_provider_1.PreferenceProvider.deepEqual(value, schema.const)) {
            return value;
        }
        return schema.const;
    }
    validateEnum(key, value, schema) {
        const options = schema.enum;
        if (options.some(option => preference_provider_1.PreferenceProvider.deepEqual(option, value))) {
            return value;
        }
        const configuredDefault = this.getDefaultFromSchema(schema);
        if (options.some(option => preference_provider_1.PreferenceProvider.deepEqual(option, configuredDefault))) {
            return configuredDefault;
        }
        return options[0];
    }
    validateBoolean(key, value, schema) {
        if (value === true || value === false) {
            return value;
        }
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return Boolean(this.getDefaultFromSchema(schema));
    }
    validateInteger(key, value, schema) {
        return Math.round(this.validateNumber(key, value, schema));
    }
    validateNumber(key, value, schema) {
        let validated = Number(value);
        if (isNaN(validated)) {
            const configuredDefault = Number(this.getDefaultFromSchema(schema));
            validated = isNaN(configuredDefault) ? 0 : configuredDefault;
        }
        if (schema.minimum !== undefined) {
            validated = Math.max(validated, schema.minimum);
        }
        if (schema.maximum !== undefined) {
            validated = Math.min(validated, schema.maximum);
        }
        return validated;
    }
    validateObject(key, value, schema) {
        if (this.objectMatchesSchema(key, value, schema)) {
            return value;
        }
        const configuredDefault = this.getDefaultFromSchema(schema);
        if (this.objectMatchesSchema(key, configuredDefault, schema)) {
            return configuredDefault;
        }
        return {};
    }
    // This evaluates most of the fields that commonly appear on PreferenceItem, but it could be improved to evaluate all possible JSON schema specifications.
    objectMatchesSchema(key, value, schema) {
        if (!value || typeof value !== 'object') {
            return false;
        }
        if (schema.required && schema.required.some(requiredField => !(requiredField in value))) {
            return false;
        }
        if (schema.additionalProperties === false && schema.properties && Object.keys(value).some(fieldKey => !(fieldKey in schema.properties))) {
            return false;
        }
        const additionalPropertyValidator = schema.additionalProperties !== true && !!schema.additionalProperties && schema.additionalProperties;
        for (const [fieldKey, fieldValue] of Object.entries(value)) {
            const fieldLabel = `${key}#${fieldKey}`;
            if (schema.properties && fieldKey in schema.properties) {
                const valid = this.validateBySchema(fieldLabel, fieldValue, schema.properties[fieldKey]);
                if (valid !== fieldValue) {
                    return false;
                }
            }
            else if (additionalPropertyValidator) {
                const valid = this.validateBySchema(fieldLabel, fieldValue, additionalPropertyValidator);
                if (valid !== fieldValue) {
                    return false;
                }
            }
        }
        return true;
    }
    validateString(key, value, schema) {
        if (typeof value === 'string') {
            return value;
        }
        if (value instanceof String) {
            return value.toString();
        }
        const configuredDefault = this.getDefaultFromSchema(schema);
        return (configuredDefault !== null && configuredDefault !== void 0 ? configuredDefault : '').toString();
    }
    getDefaultFromSchema(schema) {
        return this.schemaProvider.getDefaultValue(schema);
    }
};
__decorate([
    (0, inversify_1.inject)(preference_contribution_1.PreferenceSchemaProvider),
    __metadata("design:type", preference_contribution_1.PreferenceSchemaProvider)
], PreferenceValidationService.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preference_language_override_service_1.PreferenceLanguageOverrideService),
    __metadata("design:type", preference_language_override_service_1.PreferenceLanguageOverrideService)
], PreferenceValidationService.prototype, "languageOverrideService", void 0);
PreferenceValidationService = __decorate([
    (0, inversify_1.injectable)()
], PreferenceValidationService);
exports.PreferenceValidationService = PreferenceValidationService;
//# sourceMappingURL=preference-validation-service.js.map