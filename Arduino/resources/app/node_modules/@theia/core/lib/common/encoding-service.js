"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/services/textfile/common/encoding.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingService = void 0;
/* eslint-disable no-null/no-null */
const iconv = require("iconv-lite");
const safer_buffer_1 = require("safer-buffer");
const inversify_1 = require("inversify");
const buffer_1 = require("./buffer");
const encodings_1 = require("./encodings");
const stream_1 = require("./stream");
const ZERO_BYTE_DETECTION_BUFFER_MAX_LEN = 512; // number of bytes to look at to decide about a file being binary or not
const NO_ENCODING_GUESS_MIN_BYTES = 512; // when not auto guessing the encoding, small number of bytes are enough
const AUTO_ENCODING_GUESS_MIN_BYTES = 512 * 8; // with auto guessing we want a lot more content to be read for guessing
const AUTO_ENCODING_GUESS_MAX_BYTES = 512 * 128; // set an upper limit for the number of bytes we pass on to jschardet
// we explicitly ignore a specific set of encodings from auto guessing
// - ASCII: we never want this encoding (most UTF-8 files would happily detect as
//          ASCII files and then you could not type non-ASCII characters anymore)
// - UTF-16: we have our own detection logic for UTF-16
// - UTF-32: we do not support this encoding in VSCode
const IGNORE_ENCODINGS = ['ascii', 'utf-16', 'utf-32'];
let EncodingService = class EncodingService {
    encode(value, options) {
        let encoding = options === null || options === void 0 ? void 0 : options.encoding;
        const addBOM = options === null || options === void 0 ? void 0 : options.hasBOM;
        encoding = this.toIconvEncoding(encoding);
        if (encoding === encodings_1.UTF8 && !addBOM) {
            return buffer_1.BinaryBuffer.fromString(value);
        }
        const buffer = iconv.encode(value, encoding, { addBOM });
        return buffer_1.BinaryBuffer.wrap(buffer);
    }
    decode(value, encoding) {
        const buffer = safer_buffer_1.Buffer.from(value.buffer);
        encoding = this.toIconvEncoding(encoding);
        return iconv.decode(buffer, encoding);
    }
    exists(encoding) {
        encoding = this.toIconvEncoding(encoding);
        return iconv.encodingExists(encoding);
    }
    toIconvEncoding(encoding) {
        if (encoding === encodings_1.UTF8_with_bom || !encoding) {
            return encodings_1.UTF8; // iconv does not distinguish UTF 8 with or without BOM, so we need to help it
        }
        return encoding;
    }
    async toResourceEncoding(encoding, options) {
        // Some encodings come with a BOM automatically
        if (encoding === encodings_1.UTF16be || encoding === encodings_1.UTF16le || encoding === encodings_1.UTF8_with_bom) {
            return { encoding, hasBOM: true };
        }
        // Ensure that we preserve an existing BOM if found for UTF8
        // unless we are instructed to overwrite the encoding
        const overwriteEncoding = options === null || options === void 0 ? void 0 : options.overwriteEncoding;
        if (!overwriteEncoding && encoding === encodings_1.UTF8) {
            try {
                // stream here to avoid fetching the whole content on write
                const buffer = await options.read(encodings_1.UTF8_BOM.length);
                if (this.detectEncodingByBOMFromBuffer(safer_buffer_1.Buffer.from(buffer), buffer.byteLength) === encodings_1.UTF8_with_bom) {
                    return { encoding, hasBOM: true };
                }
            }
            catch (error) {
                // ignore - file might not exist
            }
        }
        return { encoding, hasBOM: false };
    }
    async detectEncoding(data, autoGuessEncoding) {
        const buffer = safer_buffer_1.Buffer.from(data.buffer);
        const bytesRead = data.byteLength;
        // Always first check for BOM to find out about encoding
        let encoding = this.detectEncodingByBOMFromBuffer(buffer, bytesRead);
        // Detect 0 bytes to see if file is binary or UTF-16 LE/BEÏ
        // unless we already know that this file has a UTF-16 encoding
        let seemsBinary = false;
        if (encoding !== encodings_1.UTF16be && encoding !== encodings_1.UTF16le && buffer) {
            let couldBeUTF16LE = true; // e.g. 0xAA 0x00
            let couldBeUTF16BE = true; // e.g. 0x00 0xAA
            let containsZeroByte = false;
            // This is a simplified guess to detect UTF-16 BE or LE by just checking if
            // the first 512 bytes have the 0-byte at a specific location. For UTF-16 LE
            // this would be the odd byte index and for UTF-16 BE the even one.
            // Note: this can produce false positives (a binary file that uses a 2-byte
            // encoding of the same format as UTF-16) and false negatives (a UTF-16 file
            // that is using 4 bytes to encode a character).
            for (let i = 0; i < bytesRead && i < ZERO_BYTE_DETECTION_BUFFER_MAX_LEN; i++) {
                const isEndian = (i % 2 === 1); // assume 2-byte sequences typical for UTF-16
                const isZeroByte = (buffer.readUInt8(i) === 0);
                if (isZeroByte) {
                    containsZeroByte = true;
                }
                // UTF-16 LE: expect e.g. 0xAA 0x00
                if (couldBeUTF16LE && (isEndian && !isZeroByte || !isEndian && isZeroByte)) {
                    couldBeUTF16LE = false;
                }
                // UTF-16 BE: expect e.g. 0x00 0xAA
                if (couldBeUTF16BE && (isEndian && isZeroByte || !isEndian && !isZeroByte)) {
                    couldBeUTF16BE = false;
                }
                // Return if this is neither UTF16-LE nor UTF16-BE and thus treat as binary
                if (isZeroByte && !couldBeUTF16LE && !couldBeUTF16BE) {
                    break;
                }
            }
            // Handle case of 0-byte included
            if (containsZeroByte) {
                if (couldBeUTF16LE) {
                    encoding = encodings_1.UTF16le;
                }
                else if (couldBeUTF16BE) {
                    encoding = encodings_1.UTF16be;
                }
                else {
                    seemsBinary = true;
                }
            }
        }
        // Auto guess encoding if configured
        if (autoGuessEncoding && !seemsBinary && !encoding && buffer) {
            const guessedEncoding = await this.guessEncodingByBuffer(buffer.slice(0, bytesRead));
            return {
                seemsBinary: false,
                encoding: guessedEncoding
            };
        }
        return { seemsBinary, encoding };
    }
    detectEncodingByBOMFromBuffer(buffer, bytesRead) {
        if (!buffer || bytesRead < encodings_1.UTF16be_BOM.length) {
            return undefined;
        }
        const b0 = buffer.readUInt8(0);
        const b1 = buffer.readUInt8(1);
        // UTF-16 BE
        if (b0 === encodings_1.UTF16be_BOM[0] && b1 === encodings_1.UTF16be_BOM[1]) {
            return encodings_1.UTF16be;
        }
        // UTF-16 LE
        if (b0 === encodings_1.UTF16le_BOM[0] && b1 === encodings_1.UTF16le_BOM[1]) {
            return encodings_1.UTF16le;
        }
        if (bytesRead < encodings_1.UTF8_BOM.length) {
            return undefined;
        }
        const b2 = buffer.readUInt8(2);
        // UTF-8
        if (b0 === encodings_1.UTF8_BOM[0] && b1 === encodings_1.UTF8_BOM[1] && b2 === encodings_1.UTF8_BOM[2]) {
            return encodings_1.UTF8_with_bom;
        }
        return undefined;
    }
    async guessEncodingByBuffer(buffer) {
        const jschardet = await Promise.resolve().then(() => require('jschardet'));
        const guessed = jschardet.detect(buffer.slice(0, AUTO_ENCODING_GUESS_MAX_BYTES)); // ensure to limit buffer for guessing due to https://github.com/aadsm/jschardet/issues/53
        if (!guessed || !guessed.encoding) {
            return undefined;
        }
        const enc = guessed.encoding.toLowerCase();
        if (0 <= IGNORE_ENCODINGS.indexOf(enc)) {
            return undefined; // see comment above why we ignore some encodings
        }
        return this.toIconvEncoding(guessed.encoding);
    }
    decodeStream(source, options) {
        var _a;
        const minBytesRequiredForDetection = ((_a = options.minBytesRequiredForDetection) !== null && _a !== void 0 ? _a : options.guessEncoding) ? AUTO_ENCODING_GUESS_MIN_BYTES : NO_ENCODING_GUESS_MIN_BYTES;
        return new Promise((resolve, reject) => {
            const target = (0, stream_1.newWriteableStream)(strings => strings.join(''));
            const bufferedChunks = [];
            let bytesBuffered = 0;
            let decoder = undefined;
            const createDecoder = async () => {
                try {
                    // detect encoding from buffer
                    const detected = await this.detectEncoding(buffer_1.BinaryBuffer.concat(bufferedChunks), options.guessEncoding);
                    // ensure to respect overwrite of encoding
                    detected.encoding = await options.overwriteEncoding(detected.encoding);
                    // decode and write buffered content
                    decoder = iconv.getDecoder(this.toIconvEncoding(detected.encoding));
                    const decoded = decoder.write(safer_buffer_1.Buffer.from(buffer_1.BinaryBuffer.concat(bufferedChunks).buffer));
                    target.write(decoded);
                    bufferedChunks.length = 0;
                    bytesBuffered = 0;
                    // signal to the outside our detected encoding and final decoder stream
                    resolve({
                        stream: target,
                        detected
                    });
                }
                catch (error) {
                    reject(error);
                }
            };
            // Stream error: forward to target
            source.on('error', error => target.error(error));
            // Stream data
            source.on('data', async (chunk) => {
                // if the decoder is ready, we just write directly
                if (decoder) {
                    target.write(decoder.write(safer_buffer_1.Buffer.from(chunk.buffer)));
                }
                else {
                    bufferedChunks.push(chunk);
                    bytesBuffered += chunk.byteLength;
                    // buffered enough data for encoding detection, create stream
                    if (bytesBuffered >= minBytesRequiredForDetection) {
                        // pause stream here until the decoder is ready
                        source.pause();
                        await createDecoder();
                        // resume stream now that decoder is ready but
                        // outside of this stack to reduce recursion
                        setTimeout(() => source.resume());
                    }
                }
            });
            // Stream end
            source.on('end', async () => {
                // we were still waiting for data to do the encoding
                // detection. thus, wrap up starting the stream even
                // without all the data to get things going
                if (!decoder) {
                    await createDecoder();
                }
                // end the target with the remainders of the decoder
                target.end(decoder === null || decoder === void 0 ? void 0 : decoder.end());
            });
        });
    }
    async encodeStream(value, options) {
        let encoding = options === null || options === void 0 ? void 0 : options.encoding;
        const addBOM = options === null || options === void 0 ? void 0 : options.hasBOM;
        encoding = this.toIconvEncoding(encoding);
        if (encoding === encodings_1.UTF8 && !addBOM) {
            return value === undefined ? undefined : typeof value === 'string' ?
                buffer_1.BinaryBuffer.fromString(value) : buffer_1.BinaryBufferReadable.fromReadable(value);
        }
        value = value || '';
        const readable = typeof value === 'string' ? stream_1.Readable.fromString(value) : value;
        const encoder = iconv.getEncoder(encoding, { addBOM });
        let bytesWritten = false;
        let done = false;
        return {
            read() {
                if (done) {
                    return null;
                }
                const chunk = readable.read();
                if (typeof chunk !== 'string') {
                    done = true;
                    // If we are instructed to add a BOM but we detect that no
                    // bytes have been written, we must ensure to return the BOM
                    // ourselves so that we comply with the contract.
                    if (!bytesWritten && addBOM) {
                        switch (encoding) {
                            case encodings_1.UTF8:
                            case encodings_1.UTF8_with_bom:
                                return buffer_1.BinaryBuffer.wrap(Uint8Array.from(encodings_1.UTF8_BOM));
                            case encodings_1.UTF16be:
                                return buffer_1.BinaryBuffer.wrap(Uint8Array.from(encodings_1.UTF16be_BOM));
                            case encodings_1.UTF16le:
                                return buffer_1.BinaryBuffer.wrap(Uint8Array.from(encodings_1.UTF16le_BOM));
                        }
                    }
                    const leftovers = encoder.end();
                    if (leftovers && leftovers.length > 0) {
                        bytesWritten = true;
                        return buffer_1.BinaryBuffer.wrap(leftovers);
                    }
                    return null;
                }
                bytesWritten = true;
                return buffer_1.BinaryBuffer.wrap(encoder.write(chunk));
            }
        };
    }
};
EncodingService = __decorate([
    (0, inversify_1.injectable)()
], EncodingService);
exports.EncodingService = EncodingService;
//# sourceMappingURL=encoding-service.js.map